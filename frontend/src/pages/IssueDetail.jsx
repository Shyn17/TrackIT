import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CommentBox from "../components/CommentBox";
import { getTaskById, updateTaskStatus, assignTask } from "../api/taskApi";
import { getAllUsers } from "../api/adminApi";
import { getDownloadUrl } from "../api/fileApi";
import { useAuthContext } from "../context/AuthContext";

const badgeClass = (s) => {
  if (!s) return "badge";
  const m = { OPEN: "badge badge-open", IN_PROGRESS: "badge badge-inprogress", RESOLVED: "badge badge-resolved", CLOSED: "badge badge-closed" };
  return m[s?.toUpperCase()] || "badge";
};

const priorityBadge = (p) => {
  const m = { CRITICAL: "badge badge-critical", HIGH: "badge badge-high", MEDIUM: "badge badge-medium", LOW: "badge badge-low" };
  return m[p?.toUpperCase()] || "badge";
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const STATUS_LABELS = { OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed" };
const STATUS_ICONS = { OPEN: "🔴", IN_PROGRESS: "🟡", RESOLVED: "🟢", CLOSED: "⚫" };

/**
 * Handles both Jackson formats:
 *  - ISO string: "2026-04-26T10:30:00" (after our fix)
 *  - Array:      [2026, 4, 26, 10, 30, 0]  (old responses before fix)
 */
const safeDate = (val, opts = { dateStyle: "medium", timeStyle: "short" }) => {
  if (!val) return "—";
  try {
    let d;
    if (Array.isArray(val)) {
      // Jackson array: [year, month(1-based), day, hour, min, sec]
      const [y, mo, da, h = 0, mi = 0, s = 0] = val;
      d = new Date(y, mo - 1, da, h, mi, s);
    } else {
      d = new Date(val);
    }
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString(undefined, opts);
  } catch {
    return "—";
  }
};

/* ── Progress Stepper ────────────────────────────────── */
const ProgressStepper = ({ currentStatus }) => {
  const idx = STATUSES.indexOf(currentStatus);
  return (
    <div style={{ padding: "4px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {STATUSES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STATUSES.length - 1 ? "1" : "none" }}>
              {/* Circle */}
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                background: done
                  ? "var(--success)"
                  : active
                    ? "var(--accent)"
                    : "var(--bg-surface)",
                border: `2px solid ${done ? "var(--success)" : active ? "var(--accent)" : "var(--border)"}`,
                color: done || active ? "#fff" : "var(--text-muted)",
                boxShadow: active ? "0 0 0 4px var(--accent-glow)" : "none",
                transition: "all .3s",
              }}>
                {done ? "✓" : STATUS_ICONS[s]}
              </div>

              {/* Label */}
              <div style={{
                position: "absolute",
                marginTop: 50,
                fontSize: 10,
                fontWeight: active ? 700 : 400,
                color: active ? "var(--accent)" : done ? "var(--success)" : "var(--text-muted)",
                whiteSpace: "nowrap",
                transform: "translateX(-50%)",
                marginLeft: 17,
              }}>
                {STATUS_LABELS[s]}
              </div>

              {/* Connector line */}
              {i < STATUSES.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 3,
                  background: done ? "var(--success)" : "var(--border)",
                  transition: "background .3s",
                }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Label row spacer */}
      <div style={{ height: 28 }} />
    </div>
  );
};

/* ── Detail Row ──────────────────────────────────────── */
const DetailRow = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}>
      {label}
    </div>
    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{children}</div>
  </div>
);

/* ── Avatar ──────────────────────────────────────────── */
const Avatar = ({ name }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <span style={{
      width: 26, height: 26, borderRadius: "50%",
      background: "linear-gradient(135deg,var(--accent),#818cf8)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, color: "#fff", fontWeight: 700, flexShrink: 0,
    }}>
      {(name || "?")[0].toUpperCase()}
    </span>
    {name}
  </span>
);

/* ════════════════════════════════════════════════════════ */
const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
  const isDev = role === "DEVELOPER" || role === "ROLE_DEVELOPER";
  // email stored at login in localStorage — used to check if THIS dev is the assignee
  const currentEmail = localStorage.getItem("email") || "";

  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTask = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTaskById(id);
      setTask(res.data);
      setNewStatus(res.data.status || "OPEN");
    } catch {
      setError("Failed to load task.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
    if (isAdmin) {
      getAllUsers()
        .then((r) => setUsers(Array.isArray(r.data) ? r.data : []))
        .catch(() => { });
    }
  }, [id, isAdmin, loadTask]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    setError(""); setSuccess("");
    try {
      await updateTaskStatus(id, newStatus);
      setSuccess("Status updated successfully.");
      loadTask();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || "";
      // Backend only allows the assigned developer to update status
      if (String(msg).toLowerCase().includes("authorized") || err?.response?.status === 500) {
        setError("Only the assigned developer can update this task's status. (Backend restriction)");
      } else {
        setError(msg || "Failed to update status.");
      }
    } finally { setUpdating(false); }
  };

  const handleAssign = async () => {
    if (!assignEmail) return;
    setAssigning(true);
    setError(""); setSuccess("");
    try {
      await assignTask(id, assignEmail);
      setSuccess("Task assigned successfully. The developer can now update status.");
      setAssignEmail("");
      loadTask();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || "";
      setError(String(msg) || "Failed to assign task.");
    } finally { setAssigning(false); }
  };

  if (loading) return (
    <MainLayout>
      <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading issue…</div></div>
    </MainLayout>
  );

  if (!task) return (
    <MainLayout>
      <div className="alert alert-error">{error || "Task not found."}</div>
    </MainLayout>
  );

  const assignedName = task.assignedTo
    ? (task.assignedTo.username || task.assignedTo.email)
    : null;

  const fileIcon = (name) => {
    const ext = (name || "").split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📕";
    if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
    if (["log", "txt"].includes(ext)) return "📝";
    return "📄";
  };

  return (
    <MainLayout>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/issues")} style={{ marginBottom: 12 }}>
          ← Back to All Issues
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{task.title}</h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className={badgeClass(task.status)}>{STATUS_LABELS[task.status] || task.status}</span>
              {task.priority && <span className={priorityBadge(task.priority)}>🔥 {task.priority}</span>}
              {task.severity && <span className="badge" style={{ background: "rgba(255,255,255,.06)", color: "var(--text-muted)" }}>⚡ Severity: {task.severity}</span>}
              {task.project && <span className="badge" style={{ background: "rgba(255,255,255,.06)", color: "var(--text-muted)" }}>📁 {task.project.name}</span>}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
            <div>Created: {safeDate(task.createdAt)}</div>
            <div>Updated: {safeDate(task.updatedAt)}</div>
          </div>
        </div>
      </div>

      {/* ── Progress Pipeline ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header" style={{ fontWeight: 600 }}>📊 Progress</div>
        <div className="card-body" style={{ paddingBottom: 8 }}>
          <ProgressStepper currentStatus={task.status} />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Description */}
          <div className="card">
            <div className="card-header" style={{ fontWeight: 600 }}>📋 Description</div>
            <div className="card-body">
              {task.description ? (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
                  {task.description}
                </p>
              ) : (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No description provided.</p>
              )}
            </div>
          </div>

          {/* Attachments — always shown */}
          <div className="card">
            <div className="card-header" style={{ fontWeight: 600 }}>
              📎 Attachments
              {(task.attachments || []).length > 0 && (
                <span className="badge badge-open" style={{ marginLeft: 8 }}>{task.attachments.length}</span>
              )}
            </div>
            <div className="card-body">
              {(task.attachments || []).length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 13, fontStyle: "italic" }}>No attachments uploaded.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {task.attachments.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => window.open(`http://localhost:8080/api/files/download/${f}`, "_blank")}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "10px 14px",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                        transition: "all .2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    >
                      <span style={{ fontSize: 20 }}>{fileIcon(f)}</span>
                      <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f}</span>
                      <span style={{ fontSize: 11, opacity: .6 }}>↓ Download</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="card">
            <div className="card-body">
              <CommentBox taskId={id} />
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Details card */}
          <div className="card">
            <div className="card-header" style={{ fontWeight: 600 }}>🔍 Details</div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <DetailRow label="Assigned To">
                {assignedName
                  ? <Avatar name={assignedName} />
                  : <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Unassigned</span>}
              </DetailRow>

              <DetailRow label="Assigned Email">
                {task.assignedTo?.email || <span style={{ color: "var(--text-muted)" }}>—</span>}
              </DetailRow>

              <DetailRow label="Created By">
                {task.reporterEmail ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: "#fff", fontWeight: 700, flexShrink: 0,
                    }}>
                      {task.reporterEmail[0].toUpperCase()}
                    </span>
                    <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.reporterEmail}
                    </span>
                  </span>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </DetailRow>

              <DetailRow label="Priority">
                {task.priority
                  ? <span className={priorityBadge(task.priority)}>{task.priority}</span>
                  : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </DetailRow>

              <DetailRow label="Severity">
                {task.severity || <span style={{ color: "var(--text-muted)" }}>—</span>}
              </DetailRow>

              <DetailRow label="Project">
                {task.project?.name || <span style={{ color: "var(--text-muted)" }}>—</span>}
              </DetailRow>

              <DetailRow label="Created At">
                {safeDate(task.createdAt)}
              </DetailRow>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Last Updated
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  {safeDate(task.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="card">
            <div className="card-header" style={{ fontWeight: 600 }}>🔄 Update Status</div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(() => {
                // Only the assigned developer (by email match) or admin can update
                const assigneeEmail = task.assignedTo?.email || "";
                const canUpdate = isAdmin || (isDev && currentEmail && assigneeEmail === currentEmail);

                if (!canUpdate) return (
                  <div style={{
                    fontSize: 12, color: "var(--text-muted)",
                    background: "rgba(245,158,11,.07)",
                    border: "1px solid rgba(245,158,11,.2)",
                    borderRadius: 6, padding: "10px 14px",
                  }}>
                    ⚠️ Status can only be updated by the <strong>assigned developer</strong>
                    {task.assignedTo
                      ? ` (${assigneeEmail}).`
                      : ". No developer assigned yet — contact an admin."}
                  </div>
                );

                return (
                  <>
                    <select
                      className="form-control"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleStatusUpdate}
                      disabled={updating || newStatus === task.status}
                    >
                      {updating ? "Saving…" : "Save Status"}
                    </button>
                    {newStatus === task.status && (
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                        Already at this status.
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Assign Developer (admin only) */}
          {isAdmin && (
            <div className="card">
              <div className="card-header" style={{ fontWeight: 600 }}>👤 Assign Developer</div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {assignedName && (
                  <div style={{ fontSize: 12, color: "var(--success)", background: "rgba(16,185,129,.08)", borderRadius: 6, padding: "6px 10px" }}>
                    Currently: <strong>{assignedName}</strong>
                  </div>
                )}
                <select className="form-control" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)}>
                  <option value="">— Select Developer —</option>
                  {users
                    .filter(u => u.role === "DEVELOPER" || u.role === "ROLE_DEVELOPER")
                    .map((u) => (
                      <option key={u.id} value={u.email}>{u.username || u.email}</option>
                    ))}
                </select>
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleAssign}
                  disabled={assigning || !assignEmail}
                >
                  {assigning ? "Assigning…" : "Assign"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default IssueDetail;