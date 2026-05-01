import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { createTask, createTaskWithFiles } from "../api/taskApi";
import { getAllProjects } from "../api/projectApi";

const CreateIssue = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    severity: "MINOR",
    projectId: "",
  });
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects()
      .then((r) => setProjects(Array.isArray(r.data) ? r.data : []))
      .catch(() => { });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.priority) { setError("Priority is required."); return; }
    if (!form.severity) { setError("Severity is required."); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Build task payload — backend forces status=OPEN, so we don't send status
      const taskPayload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        severity: form.severity,
        // Only include project if one is selected
        ...(form.projectId ? { project: { id: Number(form.projectId) } } : {}),
      };

      if (files.length > 0) {
        // Send as multipart — backend handles file saving internally
        await createTaskWithFiles(taskPayload, files);
      } else {
        // Pure JSON — no files
        await createTask(taskPayload);
      }

      setSuccess("Issue created successfully! Redirecting…");
      setTimeout(() => navigate("/issues"), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data
        || err?.message
        || "Failed to create issue. Check backend logs.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1>Report a Bug</h1>
          <p>Fill in the details to create a new issue. Status is automatically set to <strong>Open</strong>.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                name="title"
                className="form-control"
                placeholder="Short, descriptive summary of the bug"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={5}
                placeholder="Steps to reproduce, expected vs actual behaviour, environment…"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Priority + Severity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select name="priority" className="form-control" value={form.priority} onChange={handleChange}>
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity *</label>
                <select name="severity" className="form-control" value={form.severity} onChange={handleChange}>
                  <option value="MAJOR">🟡 MAJOR</option>
                  <option value="MINOR"> 🟢MINOR</option>
                  <option value="CRITICAL">🔴 CRITICAL</option>
                </select>
              </div>
            </div>

            {/* Project */}
            <div className="form-group">
              <label className="form-label">Project (optional)</label>
              <select name="projectId" className="form-control" value={form.projectId} onChange={handleChange}>
                <option value="">— No Project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* File Attachments */}
            <div className="form-group">
              <label className="form-label">Attachments (screenshots, logs, etc.)</label>
              <input
                type="file"
                multiple
                className="form-control"
                style={{ paddingTop: 6 }}
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
              {files.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {files.map((f, i) => (
                    <span key={i} style={{
                      fontSize: 12, background: "var(--bg-surface)",
                      border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px",
                      color: "var(--text-muted)"
                    }}>
                      📎 {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Info box */}
            <div style={{
              background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12,
              color: "var(--text-muted)"
            }}>
              ℹ️ Status is automatically set to <strong style={{ color: "var(--accent)" }}>Open</strong> when created.
              An admin can assign it to a developer who can then update progress.
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating…" : "🐛 Create Issue"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/issues")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateIssue;