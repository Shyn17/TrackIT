import { Link } from "react-router-dom";

const IssueCard = ({ issue }) => {
  return (
    <div className="card p-3 mb-2 shadow-sm">
      <h5>{issue.title}</h5>
      <p>{issue.status}</p>
      <span className="badge bg-danger">{issue.priority}</span>

      <Link to={`/issue/${issue.id}`} className="btn btn-sm btn-primary mt-2">
        View Details
      </Link>
    </div>
  );
};

export default IssueCard;