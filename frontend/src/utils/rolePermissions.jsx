export const canAccessAdmin = (role) => role === "ADMIN";

export const canEditIssue = (role) =>
  role === "ADMIN" || role === "DEVELOPER";