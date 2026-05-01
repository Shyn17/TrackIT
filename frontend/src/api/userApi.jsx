import axiosInstance from "./axiosInstance";

// ── CURRENT USER PROFILE ──────────────────────────────────────
// GET /users/me → User { id, username, email, role }
export const getMyProfile = () => axiosInstance.get("/users/me");

// ── DELETE OWN ACCOUNT ────────────────────────────────────────
export const deleteMyAccount = () => axiosInstance.delete("/users/me");