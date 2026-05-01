import { useState, useEffect, useCallback } from "react";
import { getComments, addComment } from "../api/commentApi";

const CommentBox = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await getComments(taskId);
      setComments(res.data || []);
    } catch { setComments([]); }
  }, [taskId]);

  useEffect(() => {
    if (taskId) fetchComments();
  }, [taskId, fetchComments]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      await addComment(taskId, text.trim());
      setText("");
      fetchComments();
    } catch (e) {
      setError("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts) => {
    try { return new Date(ts).toLocaleString(); } catch { return ""; }
  };

  return (
    <div>
      <h4 style={{ fontWeight: 600, marginBottom: 14, color: "var(--text-primary)" }}>
        💬 Comments ({comments.length})
      </h4>

      {comments.length === 0 ? (
        <div className="empty-state" style={{ padding: "30px 0" }}>
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-sub">No comments yet. Be the first!</div>
        </div>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div>
              <span className="comment-author">
                {c.user?.username || c.user?.email || "Unknown"}
              </span>
              <span className="comment-time">{formatTime(c.createdAt)}</span>
            </div>
            <div className="comment-text">{c.content}</div>
          </div>
        ))
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ marginTop: 16 }}>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Posting…" : "Post Comment"}
        </button>
      </div>
    </div>
  );
};

export default CommentBox;