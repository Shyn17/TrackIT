/**
 * Shared role-checking utilities.
 * Spring Security may return roles as "ADMIN" or "ROLE_ADMIN" — handle both.
 */
export const isAdmin    = (role) => role === "ADMIN"     || role === "ROLE_ADMIN";
export const isDeveloper= (role) => role === "DEVELOPER" || role === "ROLE_DEVELOPER";
export const isReporter = (role) => role === "REPORTER"  || role === "ROLE_REPORTER";

export const cleanRole = (role) =>
  role ? role.replace("ROLE_", "") : "";

export const roleBadgeClass = (role) => {
  const c = cleanRole(role).toLowerCase();
  return `badge badge-${c}`;
};
