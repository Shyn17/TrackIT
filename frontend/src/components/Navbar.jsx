import { useAuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, role, logoutUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const getRoleBadgeClass = (r) => {
    if (!r) return "badge badge-reporter";
    const clean = r.replace("ROLE_", "").toLowerCase();
    return `badge badge-${clean}`;
  };

  const displayRole = (r) => {
    if (!r) return "";
    return r.replace("ROLE_", "");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">
          {user ? `Welcome, ${user.username || user.email}` : "TrackIT"}
        </span>
        {role && (
          <span className={getRoleBadgeClass(role)}>{displayRole(role)}</span>
        )}
      </div>

      <div className="navbar-right">
        <NotificationBell />
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;