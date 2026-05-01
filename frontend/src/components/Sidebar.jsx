import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuthContext();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "sidebar-link active" : "sidebar-link";

  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
  const isDev = role === "DEVELOPER" || role === "ROLE_DEVELOPER";
  const isReporter = role === "REPORTER" || role === "ROLE_REPORTER";

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span>⚡ TrackIT</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>

        <Link to="/dashboard" className={isActive("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/issues" className={isActive("/issues")}>
          {isAdmin ? "All Issues" : isReporter ? "My Reports" : "My Assigned"}
        </Link>
        {(isAdmin || isReporter) && (
          <Link to="/create" className={isActive("/create")}>
            Report Bug
          </Link>
        )}

        {(isAdmin || isDev) && (
          <Link to="/search" className={isActive("/search")}>
            Search
          </Link>
        )}

        {/* My Tasks — developers see their assigned tasks here */}
        <Link to="/my-tasks" className={isActive("/my-tasks")}>
          {isDev ? "My Assigned Tasks" : "My Tasks"}
        </Link>

        <Link to="/notifications" className={isActive("/notifications")}>
          Notifications
        </Link>

        <span className="sidebar-section-label">Account</span>

        <Link to="/profile" className={isActive("/profile")}>
          Profile
        </Link>

        {isAdmin && (
          <>
            <span className="sidebar-section-label">Admin</span>
            <Link to="/admin" className={isActive("/admin")}>
              Admin Panel
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;