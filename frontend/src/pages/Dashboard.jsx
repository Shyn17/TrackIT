import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getDashboardStats } from "../api/dashboardApi";
import { getAssignedTasks, updateTaskStatus } from "../api/taskApi";
import { useAuthContext } from "../context/AuthContext";

/* ── Shared badge helpers ─────────────────────────────── */
const badgeClass = (s) => {
  const m = { OPEN: "badge badge-open", IN_PROGRESS: "badge badge-inprogress", RESOLVED: "badge badge-resolved", CLOSED: "badge badge-closed" };
  return m[s?.toUpperCase()] || "badge";
};
const priorityBadge = (p) => {
  const m = { CRITICAL: "badge badge-critical", HIGH: "badge badge-high", MEDIUM: "badge badge-medium", LOW: "badge badge-low" };
  return m[p?.toUpperCase()] || "badge";
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const STATUS_LABELS = { OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed" };

/* ═══════════════════════════════════════════════════════
   DEVELOPER DASHBOARD
═══════════════════════════════════════════════════════ */
const DeveloperDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({}); // { [taskId]: true }
  const [statusMap, setStatusMap] = useState({}); // { [taskId]: newStatus }
  const [msg, setMsg] = useState({}); // { [taskId]: "success"|"error" }
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAssignedTasks();
      const data = Array.isArray(res.data) ? res.data : [];
      setTasks(data);
      // Initialise statusMap from current statuses
      const map = {};
      data.forEach((t) => { map[t.id] = t.status; });
      setStatusMap(map);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load assigned tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (taskId) => {
    setSaving((p) => ({ ...p, [taskId]: true }));
    setMsg((p) => ({ ...p, [taskId]: "" }));
    try {
      await updateTaskStatus(taskId, statusMap[taskId]);
      setMsg((p) => ({ ...p, [taskId]: "success" }));
      load();
    } catch (err) {
      const m = err?.response?.data?.message || err?.response?.data || "";
      setMsg((p) => ({ ...p, [taskId]: String(m) || "error" }));
    } finally {
      setSaving((p) => ({ ...p, [taskId]: false }));
    }
  };

  const open = tasks.filter(t => t.status === "OPEN").length;
  const inProg = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const done = tasks.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1>👨‍💻 My Work Dashboard</h1>
          <p>All tasks assigned to you — update progress directly here</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load}>↻ Refresh</button>
      </div>

      {/* Summary chips */}
      {!loading && (
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total Assigned", value: tasks.length, color: "var(--accent)" },
            { label: "Open", value: open, color: "var(--info)" },
            { label: "In Progress", value: inProg, color: "var(--warning)" },
            { label: "Done", value: done, color: "var(--success)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card" style={{ flex: "1 1 140px", minWidth: 130 }}>
              <span className="stat-card-label">{label}</span>
              <span style={{ fontSize: 32, fontWeight: 700, color }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading your tasks…</div></div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <div className="empty-state-text">No tasks assigned to you yet</div>
          <div className="empty-state-sub">An admin will assign tasks to you from the issue detail page.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tasks.map((t) => {
            const selectedStatus = statusMap[t.id] || t.status;
            const changed = selectedStatus !== t.status;
            const isSaving = saving[t.id];
            const taskMsg = msg[t.id];

            return (
              <div key={t.id} className="card" style={{
                borderLeft: `3px solid ${t.status === "RESOLVED" || t.status === "CLOSED"
                  ? "var(--success)"
                  : t.status === "IN_PROGRESS"
                    ? "var(--warning)"
                    : "var(--accent)"}`,
              }}>
                <div className="card-body" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  {/* Task info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 14, cursor: "pointer", color: "var(--text-primary)" }}
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
                    {t.description && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
                        {t.description}
                      </div>
                    )}
                  </div>

                  {/* Status update inline */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <select
                      className="form-control"
                      style={{ width: 160 }}
                      value={selectedStatus}
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
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {isSaving ? "…" : changed ? "✓ Save" : "Saved"}
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/issue/${t.id}`)}
                      title="View details"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Inline feedback */}
                {taskMsg && taskMsg !== "" && (
                  <div style={{ padding: "0 20px 12px" }}>
                    {taskMsg === "success" ? (
                      <div style={{ fontSize: 12, color: "var(--success)" }}>✅ Status updated successfully.</div>
                    ) : (
                      <div style={{ fontSize: 12, color: "var(--danger)" }}>❌ {taskMsg || "Failed to update. Only the assigned developer can change status."}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

/* ═══════════════════════════════════════════════════════
   ADMIN / REPORTER DASHBOARD
═══════════════════════════════════════════════════════ */
const statusColor = (s) => {
  const m = { OPEN: "var(--accent)", IN_PROGRESS: "var(--warning)", RESOLVED: "var(--success)", CLOSED: "var(--text-muted)" };
  return m[s?.toUpperCase()] || "var(--text-muted)";
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load dashboard. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading dashboard…</div></div>
    </MainLayout>
  );

  if (error) return (
    <MainLayout><div className="alert alert-error">{error}</div></MainLayout>
  );

  const s = stats || {};

  return (
    <MainLayout>
      <div className="page-header">
        <div><h1>Dashboard</h1><p>Real-time overview of your project health</p></div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card"><span className="stat-card-label">Total Bugs</span><span className="stat-card-value purple">{s.totalBugs ?? 0}</span></div>
        <div className="stat-card"><span className="stat-card-label">In Progress</span><span className="stat-card-value yellow">{s.tasksInProgress ?? 0}</span></div>
        <div className="stat-card"><span className="stat-card-label">Resolved</span><span className="stat-card-value green">{s.tasksResolved ?? 0}</span></div>
        <div className="stat-card"><span className="stat-card-label">Closed</span><span className="stat-card-value blue">{s.tasksClosed ?? 0}</span></div>
        <div className="stat-card"><span className="stat-card-label">Total Created</span><span className="stat-card-value blue">{s.totalCreatedTasks ?? 0}</span></div>
      </div>

      {/* Progress Bar — always show if stats loaded */}
      {s.totalBugs !== undefined && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header" style={{ fontWeight: 600 }}>Resolution Progress</div>
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span>Resolved / Total</span>
              <span style={{ color: "var(--success)" }}>
                {s.progress?.completed ?? s.tasksResolved ?? 0} / {s.progress?.total ?? s.totalBugs ?? 0}
                &nbsp;({Math.round(s.progress?.completionPercentage ?? 0)}%)
              </span>
            </div>
            <div style={{ background: "var(--bg-surface)", borderRadius: 8, height: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 8,
                background: "linear-gradient(90deg, var(--accent), var(--success))",
                width: `${Math.min(100, Math.round(s.progress?.completionPercentage ?? 0))}%`,
                transition: "width .5s ease",
              }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Open Tasks */}
        <div className="table-wrap">
          <div className="card-header" style={{ fontWeight: 600 }}>🔴 Open Issues</div>
          <table>
            <thead><tr><th>Title</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              {(s.openTasks || []).length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)" }}>No open tasks</td></tr>
              ) : (s.openTasks || []).map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500 }}>{t.title}</td>
                  <td><span className={priorityBadge(t.priority)}>{t.priority}</span></td>
                  <td><span className={badgeClass(t.status)}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header" style={{ fontWeight: 600 }}>🕐 Recent Activity</div>
          <div className="card-body" style={{ padding: 0 }}>
            {(s.recentActivities || []).length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No recent activity</div>
            ) : (s.recentActivities || []).map((a) => {
              const icon = a.type === "COMMENT" ? "💬" : a.type === "TASK_UPDATE" ? "🔄" : "📋";
              const when = a.createdAt
                ? new Date(Array.isArray(a.createdAt)
                  ? new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3] || 0, a.createdAt[4] || 0)
                  : a.createdAt).toLocaleString()
                : "";
              return (
                <div key={a.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.description}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, display: "flex", gap: 8 }}>
                      <span style={{ fontWeight: 500, color: "var(--accent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                        {a.taskTitle}
                      </span>
                      {when && <span>· {when}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bugs by Status */}
      {(s.bugsByStatus || []).length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header" style={{ fontWeight: 600 }}>Bugs by Status</div>
          <div className="card-body" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {s.bugsByStatus.map((b, i) => (
              <div key={i} style={{ textAlign: "center", padding: "12px 20px", background: "var(--bg-surface)", borderRadius: 8, minWidth: 100 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: statusColor(b.status) }}>{b.count}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

/* ═══════════════════════════════════════════════════════
   ROLE-AWARE DASHBOARD ROUTER
═══════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { role, loading } = useAuthContext();

  if (loading) return (
    <MainLayout>
      <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading…</div></div>
    </MainLayout>
  );

  const isDev = role === "DEVELOPER" || role === "ROLE_DEVELOPER";
  return isDev ? <DeveloperDashboard /> : <AdminDashboard />;
};

export default Dashboard;