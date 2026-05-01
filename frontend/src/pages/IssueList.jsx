import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getAllTasks, deleteTask } from "../api/taskApi";
import { useAuthContext } from "../context/AuthContext";

/* ── Badge helpers ──────────────────────────────────────────── */
const badgeClass = (s) => {
  if (!s) return "badge";
  const m = {
    OPEN: "badge badge-open",
    IN_PROGRESS: "badge badge-inprogress",
    RESOLVED: "badge badge-resolved",
    CLOSED: "badge badge-closed",
  };
  return m[s.toString().replace(/\s+/g, "_").toUpperCase()] || "badge";
};

const priorityBadge = (p) => {
  if (!p) return "badge";
  const m = {
    CRITICAL: "badge badge-critical",
    HIGH: "badge badge-high",
    MEDIUM: "badge badge-medium",
    LOW: "badge badge-low",
  };
  return m[p.toUpperCase()] || "badge";
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    const date = Array.isArray(d)
      ? new Date(d[0], d[1] - 1, d[2])
      : new Date(d);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  } catch {
    return "—";
  }
};

/**
 * Strip the circular project→tasks→project nesting that causes the
 * Jackson "Document nesting depth (1001)" backend error.
 * We keep t.project.name but remove t.project.tasks to break the cycle.
 */
const sanitizeTask = (t) => ({
  ...t,
  project: t.project ? { id: t.project.id, name: t.project.name } : null,
});

/* ── Main Component ─────────────────────────────────────────── */
const IssueList = () => {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { role } = useAuthContext();
  const navigate = useNavigate();

  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
  const isReporter = role === "REPORTER" || role === "ROLE_REPORTER";
  const isDev = role === "DEVELOPER" || role === "ROLE_DEVELOPER";
  const currentEmail = localStorage.getItem("email") || "";

  /* ── Fetch tasks ── */
  const load = useCallback(async () => {
    if (!role) return;           // wait until auth context has resolved
    setLoading(true);
    setError("");
    try {
      const res = await getAllTasks();

      // Sanitize to remove circular project→tasks nesting
      const raw = Array.isArray(res.data) ? res.data : [];
      const data = raw.map(sanitizeTask);

      setTasks(data);
      setFiltered(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Failed to load tasks. Make sure the backend is running.";
      setError(String(msg));
      setTasks([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, [role]);

  /* ── Load when role is ready ── */
  useEffect(() => {
    if (role) load();
  }, [role, load]);

  /* ── Client-side filter ── */
  useEffect(() => {
    let data = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.reporterEmail?.toLowerCase().includes(q) ||
          t.assignedTo?.email?.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      data = data.filter((t) => t.status === statusFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, tasks]);

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    try {
      await deleteTask(id);
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Delete failed.";
      alert(String(msg));
    }
  };

  const canDelete = (task) =>
    isAdmin || (isReporter && task.reporterEmail === currentEmail);

  /* ── Status chip counts ── */
  const counts = {
    OPEN: tasks.filter((t) => t.status === "OPEN").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    RESOLVED: tasks.filter((t) => t.status === "RESOLVED").length,
    CLOSED: tasks.filter((t) => t.status === "CLOSED").length,
  };

  const pageTitle = isAdmin
    ? "All Issues"
    : isReporter
      ? "My Reported Issues"
      : "My Assigned Tasks";

  const pageSubtitle = loading
    ? "Loading…"
    : `${tasks.length} total task${tasks.length !== 1 ? "s" : ""}${filtered.length !== tasks.length ? ` · ${filtered.length} shown` : ""
    }`;

  /* ── Render ── */
  return (
    <MainLayout>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1>{pageTitle}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 13 }}>
            {pageSubtitle}
          </p>
        </div>
        {(isAdmin || isReporter) && (
          <button className="btn btn-primary" onClick={() => navigate("/create")}>
            ➕ Report Bug
          </button>
        )}
      </div>

      {/* ── Quick-filter status chips ── */}
      {!loading && tasks.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            { key: "OPEN", label: "Open", cls: "badge-open" },
            { key: "IN_PROGRESS", label: "In Progress", cls: "badge-inprogress" },
            { key: "RESOLVED", label: "Resolved", cls: "badge-resolved" },
            { key: "CLOSED", label: "Closed", cls: "badge-closed" },
          ].map(({ key, label, cls }) => (
            <button
              key={key}
              onClick={() => setStatusFilter((f) => (f === key ? "" : key))}
              style={{
                background: statusFilter === key ? "var(--bg-card-hover)" : "var(--bg-card)",
                border: `1px solid ${statusFilter === key ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--text-primary)",
                fontFamily: "Inter, sans-serif",
                transition: "all .2s",
              }}
            >
              <span className={`badge ${cls}`}>{counts[key]}</span>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        <input
          className="form-control"
          placeholder="Search by title, description, reporter or assignee…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-control"
          style={{ maxWidth: 180 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => { setSearch(""); setStatusFilter(""); }}
        >
          Clear
        </button>
        <button className="btn btn-ghost btn-sm" onClick={load}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Content ── */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading tasks…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🐛</div>
          <div className="empty-state-text">
            {tasks.length === 0
              ? isAdmin
                ? "No tasks in database yet"
                : isReporter
                  ? "You haven't reported any tasks yet"
                  : "No tasks are assigned to you yet"
              : "No tasks match your filter"}
          </div>
          <div className="empty-state-sub">
            {tasks.length === 0
              ? isAdmin || isReporter
                ? "Click 'Report Bug' to create the first one"
                : "An admin will assign tasks to you"
              : "Try adjusting your search or clear the filters"}
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created By</th>
                <th>Assigned To</th>
                <th>Project</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/issue/${t.id}`)}
                >
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    #{t.id}
                  </td>

                  <td style={{ fontWeight: 500, maxWidth: 220 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.title}
                    </div>
                    {t.severity && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                        Severity: {t.severity}
                      </div>
                    )}
                  </td>

                  <td>
                    <span className={badgeClass(t.status)}>
                      {t.status?.replace("_", " ")}
                    </span>
                  </td>

                  <td>
                    <span className={priorityBadge(t.priority)}>
                      {t.priority || "—"}
                    </span>
                  </td>

                  <td style={{ fontSize: 12 }}>
                    {t.reporterEmail ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, color: "#fff", fontWeight: 700, flexShrink: 0,
                        }}>
                          {t.reporterEmail[0].toUpperCase()}
                        </span>
                        <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.reporterEmail}
                        </span>
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>

                  <td style={{ fontSize: 12 }}>
                    {t.assignedTo ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: "linear-gradient(135deg,var(--accent),#818cf8)",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, color: "#fff", fontWeight: 700, flexShrink: 0,
                        }}>
                          {(t.assignedTo.username || t.assignedTo.email || "?")[0].toUpperCase()}
                        </span>
                        <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.assignedTo.email || t.assignedTo.username}
                        </span>
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Unassigned</span>
                    )}
                  </td>

                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {t.project?.name || "—"}
                  </td>

                  <td style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatDate(t.createdAt)}
                  </td>

                  {/* Stop row click from triggering when using action buttons */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/issue/${t.id}`)}
                      >
                        View
                      </button>
                      {canDelete(t) && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
};

export default IssueList;