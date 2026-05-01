import { useEffect, useState } from "react";
import { getAllIssues } from "../api/issueApi";

const useFetchIssues = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    getAllIssues().then(res => setIssues(res.data));
  }, []);

  return issues;
};

export default useFetchIssues;