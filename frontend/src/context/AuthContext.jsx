import { createContext, useContext, useState, useEffect } from "react";
import { getMyProfile } from "../api/userApi";

const AuthContext = createContext();

/* Normalize role */
const normalizeRole = (r) => r?.replace("ROLE_", "");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(
    normalizeRole(localStorage.getItem("role"))
  );
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await getMyProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, email, userRole) => {
    const cleanRole = normalizeRole(userRole);

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("role", cleanRole);

    setRole(cleanRole);
    loadUser();
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);