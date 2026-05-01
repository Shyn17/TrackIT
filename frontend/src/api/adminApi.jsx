import axiosInstance from "./axiosInstance";

// ═══════════════════════════════════════════
//  ADMIN — USER MANAGEMENT  (/admin/users)
// ═══════════════════════════════════════════

// GET /admin/users → List<User>
export const getAllUsers = () => axiosInstance.get("/admin/users");

// POST /admin/users → User (creates user with chosen role)
export const createUser = (user) => axiosInstance.post("/admin/users", user);

// DELETE /admin/users/{id}
export const deleteUserById = (id) =>
  axiosInstance.delete(`/admin/users/${id}`);

// ═══════════════════════════════════════════
//  ADMIN — SYSTEM SETTINGS  (/admin/settings)
// ═══════════════════════════════════════════

// GET /admin/settings → List<SystemSettings>
export const getSettings = () => axiosInstance.get("/admin/settings");

// PUT /admin/settings/{key} (body = plain string value)
export const updateSetting = (key, value) =>
  axiosInstance.put(`/admin/settings/${key}`, value, {
    headers: { "Content-Type": "text/plain" },
  });
