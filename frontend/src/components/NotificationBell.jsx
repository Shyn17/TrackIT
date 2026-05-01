import { useState, useRef, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";

const NotificationBell = () => {
  const { notifications, unreadCount, markRead, removeNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString();
    } catch { return ""; }
  };

  return (
    <div className="notif-bell-wrap" ref={ref} onClick={() => setOpen(!open)}>
      <span style={{ fontSize: 20 }}>🔔</span>
      {unreadCount > 0 && (
        <span className="notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
      )}

      {open && (
        <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 13 }}>
            Notifications
            {unreadCount > 0 && (
              <span className="badge badge-open" style={{ marginLeft: 8 }}>
                {unreadCount} new
              </span>
            )}
          </div>

          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                  onClick={() => markRead(n.id)}
                >
                  <span className="notif-item-msg">{n.message}</span>
                  <span className="notif-item-time">{formatTime(n.createdAt)}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 4, alignSelf: "flex-start" }}
                    onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                  >
                    ✕ Dismiss
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;