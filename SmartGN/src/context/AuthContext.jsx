// Frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("smartgn_token");
      const role = localStorage.getItem("smartgn_user_role");
      const userId = localStorage.getItem("smartgn_user_id");
      const userName = localStorage.getItem("smartgn_user_name");

      if (token && role) {
        return {
          token,
          role,
          userId,
          name: userName || "User",
        };
      }
    } catch (e) {
      console.error("Error initializing auth state:", e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("smartgn_token");
      const role = localStorage.getItem("smartgn_user_role");
      const userId = localStorage.getItem("smartgn_user_id");
      const userName = localStorage.getItem("smartgn_user_name");

      if (token && role) {
        setUser({
          token,
          role,
          userId,
          name: userName || "User",
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const login = (token, role, userData) => {
    localStorage.setItem("smartgn_token", token);
    localStorage.setItem("smartgn_user_role", role);

    if (userData) {
      if (userData.id) localStorage.setItem("smartgn_user_id", userData.id);
      if (userData.name)
        localStorage.setItem("smartgn_user_name", userData.name);
      if (userData.nic) localStorage.setItem("smartgn_user_id", userData.nic);
      if (userData.division)
        localStorage.setItem("smartgn_user_division", userData.division);
      if (userData.divisionName)
        localStorage.setItem("smartgn_user_division", userData.divisionName);
    }

    setUser({
      token,
      role,
      userId: userData?.id || userData?.nic || "",
      name: userData?.name || "User",
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
