import axiosInstance from "./axiosInstance";


const postTaskMultipart = (taskData, files = []) => {
  const form = new FormData();
  form.append(
    "task",
    new Blob([JSON.stringify(taskData)], { type: "application/json" })
  );
  Array.from(files).forEach((f) => form.append("files", f));
  return axiosInstance.post("/tasks", form);
};

export const createTask = (taskData) => postTaskMultipart(taskData, []);

export const createTaskWithFiles = (taskData, files) =>
  postTaskMultipart(taskData, files);
// ── GET ALL TASKS ─────────────────────────────────────────────
export const getAllTasks = () => axiosInstance.get("/tasks");

// ── GET TASK BY ID (direct endpoint — accessible to all roles) ─
export const getTaskById = (id) => axiosInstance.get(`/tasks/${id}`);

// ── ADVANCED SEARCH (paginated) ───────────────────────────────
export const searchTasks = (body, page = 0, size = 10) =>
  axiosInstance.post(`/tasks/search?page=${page}&size=${size}`, body);

// ── MY TASKS (tasks I created / reported) ─────────────────────
export const getMyTasks = () => axiosInstance.get("/tasks/my");

// ── TASKS ASSIGNED TO ME ──────────────────────────────────────
export const getAssignedTasks = () => axiosInstance.get("/tasks/assigned");

// ── ASSIGN TASK TO DEVELOPER (Admin only) ─────────────────────
export const assignTask = (taskId, devEmail) =>
  axiosInstance.put(`/tasks/assign?taskId=${taskId}&devEmail=${devEmail}`);

// ── UPDATE TASK STATUS (assigned developer only) ──────────────
export const updateTaskStatus = (taskId, status) =>
  axiosInstance.put(`/tasks/status?taskId=${taskId}&status=${status}`);

// ── DELETE TASK (Admin only) ───────────────────────────────────
export const deleteTask = (id) => axiosInstance.delete(`/tasks/${id}`);

// ── ATTACHMENT DOWNLOAD URL ───────────────────────────────────
export const getAttachmentUrl = (taskId, fileName) =>
  `http://localhost:8080/tasks/${taskId}/attachments/${fileName}`;