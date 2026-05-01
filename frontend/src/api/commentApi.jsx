import axiosInstance from "./axiosInstance";

export const getComments = (taskId) =>
    axiosInstance.get(`/tasks/${taskId}/comments`); //

export const addComment = (taskId, content) =>
    axiosInstance.post(`/tasks/${taskId}/comments`, { content }); // Matches CommentRequest DTO