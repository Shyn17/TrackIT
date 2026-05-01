import { createContext, useContext, useState, useEffect } from "react";
import { getAllTasks } from "../api/taskApi";

const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await getAllTasks();
      setIssues(res.data);
    } catch {
      setIssues([]);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated
    if (localStorage.getItem("token")) {
      fetchIssues();
    }
  }, []);

  return (
    <IssueContext.Provider value={{ issues, fetchIssues }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssueContext = () => useContext(IssueContext);