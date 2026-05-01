/**
 * issueApi.jsx — re-exports from taskApi for backward compatibility.
 * The backend uses /tasks (not /issues). All callers of this file
 * should migrate to taskApi.jsx directly.
 */
export {
  getAllTasks as getAllIssues,
  getTaskById as getIssueById,
  createTask as createIssue,
  deleteTask as deleteIssue,
} from "./taskApi";