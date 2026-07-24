import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaBriefcase, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../services/authService.js';
import { ROUTES } from '../utils/constants.js';

function JNavbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => navigate(ROUTES.JOBS)}
          className="flex items-center gap-2 focus-ring rounded-lg"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <FaShieldAlt size={16} />
          </span>
          <span className="text-lg font-extrabold text-gray-900">
            Verify<span className="text-brand-500">Hire</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.JOBS)}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-ring"
          >
            <FaBriefcase size={14} />
            Jobs
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus-ring"
          >
            <FaSignOutAlt size={14} />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default JNavbar;
