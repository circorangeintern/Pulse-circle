import { Link, useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaHome,
  FaBriefcase,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { logout } from '../services/authService.js';
import { usersApi } from '../services/api.js';
import { ROUTES } from '../utils/constants.js';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      usersApi.getMe().then((r) => setIsAdmin(r.data.role === "admin")).catch(() => {});
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <header className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Verify</span>
            <span className="text-orange-500">Hire</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-10 text-gray-700 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-orange-500 transition"
                aria-label="Home page"
              >
                <FaHome aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                to={ROUTES.JOBS}
                className="flex items-center gap-2 hover:text-orange-500 transition"
                aria-label="Browse jobs"
              >
                <FaBriefcase aria-hidden="true" />
                <span>Jobs</span>
              </Link>
            </li>

            {isAdmin && (
              <li>
                <Link
                  to={ROUTES.ADMIN}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
                  aria-label="Admin dashboard"
                >
                  <FaUserShield aria-hidden="true" />
                  <span>Admin</span>
                </Link>
              </li>
            )}

            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-orange-500 transition"
                  aria-label="Sign out of your account"
                >
                  <FaSignOutAlt aria-hidden="true" />
                  <span>Log out</span>
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to={ROUTES.LOGIN}
                  className="flex items-center gap-2 hover:text-orange-500 transition"
                  aria-label="Log in to your account"
                >
                  <FaSignInAlt aria-hidden="true" />
                  <span>Log in</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
