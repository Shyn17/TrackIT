import axiosInstance from "./axiosInstance";

// ── DASHBOARD STATS ───────────────────────────────────────────
// Returns DashboardStatsResponse:
//   { totalBugs, totalCreatedTasks, tasksInProgress, tasksResolved,
//     tasksClosed, createdTasks[], openTasks[], recentActivities[],
//     bugsByStatus[], progress }
export const getDashboardStats = () => axiosInstance.get("/dashboard/stats");