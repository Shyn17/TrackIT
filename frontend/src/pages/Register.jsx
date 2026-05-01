import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "DEVELOPER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await register(form);
      setSuccess("Registered successfully! Redirecting to login…");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⚡ TrackIT</div>
        <p className="auth-subtitle">Create your account</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              name="username"
              className="form-control"
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-control"
              value={form.role}
              onChange={handleChange}
            >
              <option value="DEVELOPER">Developer</option>
              <option value="REPORTER">Reporter</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;