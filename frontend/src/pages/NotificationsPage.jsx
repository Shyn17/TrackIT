import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNotification } from "../context/NotificationContext";

const typeIcon = (t) => {
  const m = {
    TASK_ASSIGNED: "📌",
    TASK_UPDATED: "✏️",
    TASK_COMPLETED: "✅",
    COMMENT_ADDED: "💬",
    SYSTEM_ALERT: "🔔",
  };
  return m[t] || "🔔";
};

const NotificationsPage = () => {
  const { notifications, fetchNotifications, markRead, removeNotification } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const formatTime = (ts) => {
    try { return new Date(ts).toLocaleString(); } catch { return ""; }
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>{unread.length} unread notification{unread.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchNotifications}>↻ Refresh</button>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <div className="empty-state-text">No notifications yet</div>
          <div className="empty-state-sub">You'll be notified when tasks are assigned or updated.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...unread, ...read].map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                borderLeft: !n.read ? "3px solid var(--accent)" : "3px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => !n.read && markRead(n.id)}
            >
              <div className="card-body" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{typeIcon(n.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: !n.read ? 600 : 400, fontSize: 14 }}>{n.message}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    {n.type} · {formatTime(n.createdAt)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {!n.read && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default NotificationsPage;
