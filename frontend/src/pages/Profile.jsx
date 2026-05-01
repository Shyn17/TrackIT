import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getMyProfile, deleteMyAccount } from "../api/userApi";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logoutUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    getMyProfile()
      .then((r) => setProfile(r.data))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      await deleteMyAccount();
      logoutUser();
      navigate("/");
    } catch {
      setError("Failed to delete account.");
    }
  };

  const roleBadge = (r) => {
    if (!r) return "badge";
    const c = r.replace("ROLE_","").toLowerCase();
    return `badge badge-${c}`;
  };

  if (loading) return (
    <MainLayout>
      <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading profile…</div></div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="page-header">
        <div><h1>My Profile</h1><p>Your account details</p></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {profile && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-body">
            {/* Avatar placeholder */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 700, color: "#fff"
              }}>
                {(profile.username || profile.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{profile.username || "—"}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{profile.email}</div>
                <span className={roleBadge(profile.role)} style={{ marginTop: 4, display: "inline-block" }}>
                  {profile.role?.replace("ROLE_","")}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>User ID</span>
                <span style={{ fontWeight: 500 }}>#{profile.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Username</span>
                <span style={{ fontWeight: 500 }}>{profile.username || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Email</span>
                <span style={{ fontWeight: 500 }}>{profile.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Role</span>
                <span className={roleBadge(profile.role)}>{profile.role?.replace("ROLE_","")}</span>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
                🗑️ Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Profile;