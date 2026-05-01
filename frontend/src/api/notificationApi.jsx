import axiosInstance from "./axiosInstance";

// ── GET ALL NOTIFICATIONS ────────────────────────────────────────
export const getAllNotifications = () =>
  axiosInstance.get("/api/notifications");

// ── GET UNREAD NOTIFICATIONS ─────────────────────────────────────
export const getUnreadNotifications = () =>
  axiosInstance.get("/api/notifications/unread");

// ── GET UNREAD COUNT ─────────────────────────────────────────────
export const getUnreadCount = () =>
  axiosInstance.get("/api/notifications/unread/count");

// ── MARK AS READ ─────────────────────────────────────────────────
export const markAsRead = (id) =>
  axiosInstance.put(`/api/notifications/${id}/read`);

// ── DELETE NOTIFICATION ──────────────────────────────────────────
export const deleteNotification = (id) =>
  axiosInstance.delete(`/api/notifications/${id}`);
