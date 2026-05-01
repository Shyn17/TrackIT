import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getUnreadCount,
  getAllNotifications,
  markAsRead,
  deleteNotification,
} from "../api/notificationApi";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await getAllNotifications();
      setNotifications(res.data || []);
    } catch { setNotifications([]); }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data || 0);
    } catch { setUnreadCount(0); }
  }, []);

  const markRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, markRead, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);