import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getMyTasks, getAssignedTasks, updateTaskStatus } from "../api/taskApi";

const badgeClass = (s) => {
  if (!s) return "badge";
  const m = { OPEN: "badge badge-open", IN_PROGRESS: "badge badge-inprogress", RESOLVED: "badge badge-resolved", CLOSED: "badge badge-closed" };
  return m[s.toUpperCase()] || "badge";
};

const priorityBadge = (p) => {
  const m = { CRITICAL: "badge badge-critical", HIGH: "badge badge-high", MEDIUM: "badge badge-medium", LOW: "badge badge-low" };
  return m[p?.toUpperCase()] || "badge";
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const STATUS_LABELS = { OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed" };

/* ── Simple read-only task table (for "Reported by Me" tab) ─── */
const ReportedTable = ({ tasks, navigate }) => (
  tasks.length === 0 ? (
    <div className="empty-state">
      <div className="empty-state-icon">📝</div>
      <div className="empty-state-text">You haven't reported any tasks yet</div>
    </div>
  ) : (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Title</th><th>Status</th><th>Priority</th><th>Severity</th><th>Project</th><th></th></tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr
              key={t.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/issue/${t.id}`)}
            >
              <td style={{ color: "var(--text-muted)", fontSize: 12 }}>#{t.id}</td>
              <td style={{ fontWeight: 500, color: "var(--accent)" }}>{t.title}</td>
              <td><span className={badgeClass(t.status)}>{STATUS_LABELS[t.status] || t.status}</span></td>
              <td><span className={priorityBadge(t.priority)}>{t.priority || "—"}</span></td>
              <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.severity || "—"}</td>
              <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.project?.name || "—"}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/issue/${t.id}`)}
                >
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
);


/* ── Assigned tasks with inline status update ─────────────── */
const AssignedTable = ({ tasks, navigate, onRefresh }) => {
  const [statusMap, setStatusMap] = useState({});
  const [saving, setSaving] = useState({});
  const [msg, setMsg] = useState({});

  // Initialise status map from current task statuses
  useEffect(() => {
    const m = {};
    tasks.forEach((t) => { m[t.id] = t.status; });
    setStatusMap(m);
  }, [tasks]);

  const handleSave = async (taskId) => {
    setSaving((p) => ({ ...p, [taskId]: true }));
    setMsg((p) => ({ ...p, [taskId]: "" }));
    try {
      await updateTaskStatus(taskId, statusMap[taskId]);
      setMsg((p) => ({ ...p, [taskId]: "success" }));
      if (onRefresh) onRefresh();
    } catch (err) {
      const m = err?.response?.data?.message || err?.response?.data || "";
      setMsg((p) => ({ ...p, [taskId]: String(m) || "error" }));
    } finally {
      setSaving((p) => ({ ...p, [taskId]: false }));
    }
  };

  if (tasks.length === 0) return (
    <div className="empty-state">
      <div className="empty-state-icon">🎉</div>
      <div className="empty-state-text">No tasks assigned to you</div>
      <div className="empty-state-sub">When an admin assigns you a task, it'll appear here.</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tasks.map((t) => {
        const selected = statusMap[t.id] || t.status;
        const changed  = selected !== t.status;
        const isSaving = saving[t.id];
        const taskMsg  = msg[t.id];

        return (
          <div key={t.id} className="card" style={{
            borderLeft: `3px solid ${t.status === "RESOLVED" || t.status === "CLOSED"
              ? "var(--success)"
              : t.status === "IN_PROGRESS"
              ? "var(--warning)"
              : "var(--accent)"}`,
          }}>
            <div className="card-body" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div
                  style={{ fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                  onClick={() => navigate(`/issue/${t.id}`)}
                >
                  #{t.id} — {t.title}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                  <span className={badgeClass(t.status)}>{STATUS_LABELS[t.status] || t.status}</span>
                  {t.priority && <span className={priorityBadge(t.priority)}>{t.priority}</span>}
                  {t.project && (
                    <span className="badge" style={{ background: "rgba(255,255,255,.06)", color: "var(--text-muted)" }}>
                      📁 {t.project.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Inline status update */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <select
                  className="form-control"
                  style={{ width: 150 }}
                  value={selected}
                  onChange={(e) => setStatusMap((p) => ({ ...p, [t.id]: e.target.value }))}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>

                <button
                  className={`btn btn-sm ${changed ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => handleSave(t.id)}
                  disabled={!changed || isSaving}
                >
                  {isSaving ? "…" : changed ? "✓ Save" : "Saved"}
                </button>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/issue/${t.id}`)}
                  title="View full details"
                >
                  →
                </button>
              </div>
            </div>

            {/* Per-task feedback */}
            {taskMsg && (
              <div style={{ padding: "0 20px 10px" }}>
                {taskMsg === "success"
                  ? <span style={{ fontSize: 12, color: "var(--success)" }}>✅ Status updated.</span>
                  : <span style={{ fontSize: 12, color: "var(--danger)" }}>❌ {taskMsg || "Only the assigned developer can update status."}</span>
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MY TASKS PAGE
═══════════════════════════════════════════════════════ */
const MyTasksPage = () => {
  const [tab, setTab] = useState("assigned");
  const [reported, setReported] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loadingR, setLoadingR] = useState(true);
  const [loadingA, setLoadingA] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadReported = () => {
    setLoadingR(true);
    getMyTasks()
      .then((r) => setReported(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError("Failed to load reported tasks."))
      .finally(() => setLoadingR(false));
  };

  const loadAssigned = () => {
    setLoadingA(true);
    getAssignedTasks()
      .then((r) => setAssigned(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoadingA(false));
  };

  useEffect(() => {
    loadReported();
    loadAssigned();
  }, []);

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Tasks you reported or are assigned to you</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => { loadReported(); loadAssigned(); }}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        <button
          className={`tab-btn ${tab === "assigned" ? "active" : ""}`}
          onClick={() => setTab("assigned")}
        >
          👤 Assigned to Me ({assigned.length})
        </button>
        <button
          className={`tab-btn ${tab === "reported" ? "active" : ""}`}
          onClick={() => setTab("reported")}
        >
          📝 Reported by Me ({reported.length})
        </button>
      </div>

      {tab === "assigned" && (
        loadingA
          ? <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading…</div></div>
          : <AssignedTable tasks={assigned} navigate={navigate} onRefresh={loadAssigned} />
      )}

      {tab === "reported" && (
        loadingR
          ? <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading…</div></div>
          : <ReportedTable tasks={reported} navigate={navigate} />
      )}
    </MainLayout>
  );
};

export default MyTasksPage;
