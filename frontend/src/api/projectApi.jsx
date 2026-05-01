import axiosInstance from "./axiosInstance";

// ── GET ALL PROJECTS ─────────────────────────────────────────────
export const getAllProjects = () => axiosInstance.get("/projects");

// ── GET PROJECT BY ID ────────────────────────────────────────────
export const getProjectById = (id) => axiosInstance.get(`/projects/${id}`);

// ── CREATE PROJECT (ADMIN only) ──────────────────────────────────
export const createProject = (project) =>
  axiosInstance.post("/projects", project);
