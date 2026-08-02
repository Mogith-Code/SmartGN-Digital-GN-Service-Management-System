export const getAuthHeaders = () => {
  const token =
    localStorage.getItem("smartgn_token") ||
    localStorage.getItem("smartgn_access_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export const authenticatedFetch = (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };
  return fetch(url, {
    ...options,
    headers,
  });
};

// Helper to get user role from token or localStorage
export const getUserRole = () => {
  return localStorage.getItem("smartgn_user_role") || "RESIDENT";
};

// Helper to get user ID from token or localStorage
export const getUserId = () => {
  return localStorage.getItem("smartgn_user_id") || "";
};

// Helper to get user name
export const getUserName = () => {
  return localStorage.getItem("smartgn_user_name") || "";
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token =
    localStorage.getItem("smartgn_token") ||
    localStorage.getItem("smartgn_access_token");
  return !!token;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("smartgn_token");
  localStorage.removeItem("smartgn_access_token");
  localStorage.removeItem("smartgn_user_role");
  localStorage.removeItem("smartgn_user_id");
  localStorage.removeItem("smartgn_user_name");
  localStorage.removeItem("smartgn_user_division");
  window.location.href = "/login";
};
