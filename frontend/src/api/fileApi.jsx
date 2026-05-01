import axiosInstance from "./axiosInstance";

// ── UPLOAD FILE ──────────────────────────────────────────────────
// Returns FileUploadResponse: { fileName, originalFileName, fileType, fileSize, downloadUrl, message }
export const uploadFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return axiosInstance.post("/api/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ── GET DOWNLOAD URL ─────────────────────────────────────────────
export const getDownloadUrl = (fileName) =>
  `http://localhost:8080/api/files/download/${fileName}`;
