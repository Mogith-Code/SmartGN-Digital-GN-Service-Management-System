// Frontend/src/Pages/Unauthorized.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const getDashboardLink = () => {
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "OFFICER") return "/OfficerDashboard";
    if (role === "RESIDENT") return "/ResidentDashboard";
    return "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate(getDashboardLink())}
          className="w-full py-2 px-4 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium rounded-md transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
