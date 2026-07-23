import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService.js";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../utils/constants.js";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Welcome{user?.displayName ? `, ${user.displayName}` : ""} 👋
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          You&apos;re signed in as <span className="font-medium text-gray-700">{user?.email}</span>
        </p>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 focus-ring transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
