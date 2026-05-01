import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { searchTasks } from "../api/taskApi";

const badgeClass = (s) => {
  if (!s) return "badge";
  const m = { OPEN: "badge badge-open", IN_PROGRESS: "badge badge-inprogress", RESOLVED: "badge badge-resolved", CLOSED: "badge badge-closed" };
  return m[s.toUpperCase()] || "badge";
};

const priorityBadge = (p) => {
  const m = { CRITICAL: "badge badge-critical", HIGH: "badge badge-high", MEDIUM: "badge badge-medium", LOW: "badge badge-low" };
  return m[p?.toUpperCase()] || "badge";
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    keyword: "",
    status: "",
    priority: "",
    severity: "",
    fromDate: "",
    toDate: "",
  });
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildBody = () => {
    const body = {};
    if (form.keyword) body.keyword = form.keyword;
    if (form.status) body.status = form.status;
    if (form.priority) body.priority = form.priority;
    if (form.severity) body.severity = form.severity;
    if (form.fromDate) body.fromDate = form.fromDate + "T00:00:00";
    if (form.toDate) body.toDate = form.toDate + "T23:59:59";
    return body;
  };

  const doSearch = async (p = 0) => {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await searchTasks(buildBody(), p, 10);
      const content = res.data?.content;
      setResults(Array.isArray(content) ? content : []);
      setTotalPages(res.data?.totalPages || 0);
      setPage(p);
    } catch {
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); doSearch(0); };

  return (
    <MainLayout>
      <div className="page-header">
        <div><h1>Search Issues</h1><p>Filter by keyword, status, priority, severity and date range</p></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Keyword</label>
                <input name="keyword" className="form-control" placeholder="Search in title or description…" value={form.keyword} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  <option value="">Any</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Priority</label>
                <select name="priority" className="form-control" value={form.priority} onChange={handleChange}>
                  <option value="">Any</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Severity</label>
                <select name="severity" className="form-control" value={form.severity} onChange={handleChange}>
                  <option value="">Any</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">From Date</label>
                <input type="date" name="fromDate" className="form-control" value={form.fromDate} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">To Date</label>
                <input type="date" name="toDate" className="form-control" value={form.toDate} onChange={handleChange} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Searching…" : "🔍 Search"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => { setForm({ keyword:"",status:"",priority:"",severity:"",fromDate:"",toDate:"" }); setResults([]); setSearched(false); }}>
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {searched && !loading && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No results found</div>
          <div className="empty-state-sub">Try different keywords or filters</div>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Title</th><th>Status</th><th>Priority</th><th>Severity</th><th>Assigned To</th><th></th></tr>
              </thead>
              <tbody>
                {results.map((t) => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>#{t.id}</td>
                    <td style={{ fontWeight: 500 }}>{t.title}</td>
                    <td><span className={badgeClass(t.status)}>{t.status}</span></td>
                    <td><span className={priorityBadge(t.priority)}>{t.priority || "—"}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.severity || "—"}</td>
                    <td style={{ fontSize: 12 }}>{t.assignedTo ? (t.assignedTo.username || t.assignedTo.email) : <span style={{ color: "var(--text-muted)" }}>Unassigned</span>}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => navigate(`/issue/${t.id}`)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => doSearch(page - 1)}>← Prev</button>
              <span style={{ lineHeight: "32px", fontSize: 13, color: "var(--text-muted)" }}>Page {page + 1} / {totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page >= totalPages - 1} onClick={() => doSearch(page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default SearchPage;
