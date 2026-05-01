import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getAllUsers, createUser, deleteUserById, getSettings, updateSetting } from "../api/adminApi";
import { getAllProjects, createProject } from "../api/projectApi";
import { useAuthContext } from "../context/AuthContext";
import { isAdmin as checkAdmin } from "../utils/roleUtils";

const AdminPanel = () => {
  const { role, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState("users");

  // Guard: redirect non-admins
  useEffect(() => {
    if (!authLoading && !checkAdmin(role)) navigate("/dashboard");
  }, [role, authLoading, navigate]);

  // ── Users ──────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", role: "DEVELOPER" });
  const [userError, setUserError] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [userSaving, setUserSaving] = useState(false);

  const loadUsers = async () => {
    setUserLoading(true);
    try {
      const r = await getAllUsers();
      setUsers(Array.isArray(r.data) ? r.data : []);
    } catch (err) {
      setUserError(err?.response?.data?.message || "Failed to load users. Check backend.");
      setUsers([]);
    }
    setUserLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.username || !userForm.email || !userForm.password) { setUserError("All fields required."); return; }
    setUserSaving(true); setUserError("");
    try { await createUser(userForm); setUserForm({ username: "", email: "", password: "", role: "DEVELOPER" }); loadUsers(); }
    catch (err) { setUserError(err?.response?.data?.message || "Failed to create user."); }
    finally { setUserSaving(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await deleteUserById(id); loadUsers(); } catch { alert("Failed to delete user."); }
  };

  // ── Projects ───────────────────────────────────────
  const [projects, setProjects] = useState([]);
  const [projForm, setProjForm] = useState({ name: "", description: "" });
  const [projError, setProjError] = useState("");
  const [projSaving, setProjSaving] = useState(false);

  const loadProjects = async () => {
    try {
      const r = await getAllProjects();
      setProjects(Array.isArray(r.data) ? r.data : []);
    } catch { setProjects([]); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projForm.name.trim()) { setProjError("Project name is required."); return; }
    setProjSaving(true); setProjError("");
    try { await createProject(projForm); setProjForm({ name: "", description: "" }); loadProjects(); }
    catch (err) { setProjError(err?.response?.data?.message || "Failed to create project."); }
    finally { setProjSaving(false); }
  };

  // ── Settings ───────────────────────────────────────
  const [settings, setSettings] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [settingSaving, setSettingSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const r = await getSettings();
      setSettings(Array.isArray(r.data) ? r.data : []);
    } catch { setSettings([]); }
  };

  const handleSaveSetting = async (key) => {
    setSettingSaving(true);
    try { await updateSetting(key, editValue); setEditingKey(null); loadSettings(); }
    catch { alert("Failed to save setting."); }
    finally { setSettingSaving(false); }
  };

  useEffect(() => {
    loadUsers(); loadProjects(); loadSettings();
  }, []);

  const roleBadge = (r) => {
    if (!r) return "badge";
    const c = r.replace("ROLE_","").toLowerCase();
    return `badge badge-${c}`;
  };

  // While auth context is still loading, show nothing to avoid stale state renders
  if (authLoading) return (
    <MainLayout>
      <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Loading…</div></div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="page-header">
        <div><h1>Admin Panel</h1><p>Manage users, projects and system settings</p></div>
      </div>

      <div className="tabs">
        {["users","projects","settings"].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "users" ? "👥 Users" : t === "projects" ? "📁 Projects" : "⚙️ Settings"}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {tab === "users" && (
        <div>
          {/* Create Form */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header" style={{ fontWeight: 600 }}>Create New User</div>
            <div className="card-body">
              <form onSubmit={handleCreateUser}>
                {userError && <div className="alert alert-error">{userError}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Username</label>
                    <input className="form-control" placeholder="johndoe" value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" placeholder="email@example.com" value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" placeholder="••••••" value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Role</label>
                    <select className="form-control" value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                      <option value="DEVELOPER">Developer</option>
                      <option value="REPORTER">Reporter</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={userSaving}>
                    {userSaving ? "…" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Users Table */}
          {userLoading ? (
            <div className="empty-state"><div className="empty-state-text">Loading users…</div></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>#{u.id}</td>
                      <td style={{ fontWeight: 500 }}>{u.username}</td>
                      <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                      <td><span className={roleBadge(u.role)}>{u.role?.replace("ROLE_","")}</span></td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── PROJECTS TAB ── */}
      {tab === "projects" && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header" style={{ fontWeight: 600 }}>Create New Project</div>
            <div className="card-body">
              <form onSubmit={handleCreateProject}>
                {projError && <div className="alert alert-error">{projError}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 10, alignItems: "end" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Project Name</label>
                    <input className="form-control" placeholder="My Project" value={projForm.name}
                      onChange={(e) => setProjForm({ ...projForm, name: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Description</label>
                    <input className="form-control" placeholder="Short description…" value={projForm.description}
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={projSaving}>
                    {projSaving ? "…" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Description</th><th>Created</th></tr></thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No projects yet</td></tr>
                ) : projects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>#{p.id}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: "var(--text-muted)" }}>{p.description || "—"}</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {tab === "settings" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Key</th><th>Value</th><th>Description</th><th>Action</th></tr></thead>
            <tbody>
              {settings.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No settings configured</td></tr>
              ) : settings.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, fontSize: 12, color: "var(--accent)" }}>{s.settingKey}</td>
                  <td>
                    {editingKey === s.settingKey ? (
                      <input className="form-control" value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ maxWidth: 200 }} />
                    ) : (
                      <span>{s.settingValue}</span>
                    )}
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{s.description}</td>
                  <td>
                    {editingKey === s.settingKey ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-success btn-sm" disabled={settingSaving} onClick={() => handleSaveSetting(s.settingKey)}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingKey(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditingKey(s.settingKey); setEditValue(s.settingValue); }}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminPanel;