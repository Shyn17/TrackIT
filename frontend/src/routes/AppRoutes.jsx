import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Login            from "../pages/Login";
import Register         from "../pages/Register";
import Dashboard        from "../pages/Dashboard";
import IssueList        from "../pages/IssueList";
import IssueDetail      from "../pages/IssueDetail";
import CreateIssue      from "../pages/CreateIssue";
import AdminPanel       from "../pages/AdminPanel";
import Profile          from "../pages/Profile";
import NotificationsPage from "../pages/NotificationsPage";
import SearchPage       from "../pages/SearchPage";
import MyTasksPage      from "../pages/MyTasksPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/issues"    element={<PrivateRoute><IssueList /></PrivateRoute>} />
        <Route path="/issue/:id" element={<PrivateRoute><IssueDetail /></PrivateRoute>} />
        <Route path="/create"    element={<PrivateRoute><CreateIssue /></PrivateRoute>} />
        <Route path="/search"    element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/my-tasks"  element={<PrivateRoute><MyTasksPage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin"     element={<PrivateRoute><AdminPanel /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;