import { Link, useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaHome,
  FaBriefcase,
  FaSignInAlt,
  FaSignOutAlt,
<<<<<<< HEAD
  FaTachometerAlt,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth.js';
import { logout } from '../services/authService.js';
import { ROUTES } from '../utils/constants.js';

const Navbar = () => {
  const { user, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = user && isEmailVerified;
=======
  FaUserShield,
  FaBars,
  FaTimes,
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      usersApi.getMe().then((r) => setIsAdmin(r.data.role === "admin")).catch(() => {});
    } else {
      setIsAdmin(false);
    }
  }, [user]);
>>>>>>> 0948f907775552d7842c98a19f372989e9207840

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

<<<<<<< HEAD
=======
  function closeMenu() {
    setMenuOpen(false);
  }

>>>>>>> 0948f907775552d7842c98a19f372989e9207840
  return (
    <header className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
<<<<<<< HEAD
        <Link to="/" className="flex items-center gap-3">
=======
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Verify</span>
            <span className="text-orange-500">Hire</span>
          </h1>
        </Link>

<<<<<<< HEAD
        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-10 text-gray-700 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-orange-500 transition"
              >
                <FaHome />
                Home
              </Link>
            </li>

            <li>
              <Link
                to={ROUTES.JOBS}
                className="flex items-center gap-2 hover:text-orange-500 transition"
              >
                <FaBriefcase />
                Jobs
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="flex items-center gap-2 hover:text-orange-500 transition"
                  >
                    <FaTachometerAlt />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-orange-500 transition"
                  >
                    <FaSignOutAlt />
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to={ROUTES.LOGIN}
                  className="flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <FaSignInAlt />
                  Log in
=======
        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-10 text-gray-700 font-medium">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-orange-500 transition" aria-label="Home page">
                <FaHome aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.JOBS} className="flex items-center gap-2 hover:text-orange-500 transition" aria-label="Browse jobs">
                <FaBriefcase aria-hidden="true" />
                <span>Jobs</span>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to={ROUTES.ADMIN} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition" aria-label="Admin dashboard">
                  <FaUserShield aria-hidden="true" />
                  <span>Admin</span>
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2 hover:text-orange-500 transition" aria-label="Sign out">
                  <FaSignOutAlt aria-hidden="true" />
                  <span>Log out</span>
                </button>
              </li>
            ) : (
              <li>
                <Link to={ROUTES.LOGIN} className="flex items-center gap-2 hover:text-orange-500 transition" aria-label="Log in">
                  <FaSignInAlt aria-hidden="true" />
                  <span>Log in</span>
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
                </Link>
              </li>
            )}
          </ul>
        </nav>
<<<<<<< HEAD
      </div>
=======

        {/* Hamburger Button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 animate-fade-in">
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-3 text-gray-700 font-medium">
              <li>
                <Link to="/" onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <FaHome aria-hidden="true" className="text-base" />
                  Home
                </Link>
              </li>
              <li>
                <Link to={ROUTES.JOBS} onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <FaBriefcase aria-hidden="true" className="text-base" />
                  Jobs
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to={ROUTES.ADMIN} onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-purple-600 hover:bg-purple-50 transition-colors">
                    <FaUserShield aria-hidden="true" className="text-base" />
                    Admin
                  </Link>
                </li>
              )}
              <li className="border-t border-gray-100 pt-2 mt-1">
                {isLoggedIn ? (
                  <button onClick={() => { handleLogout(); closeMenu(); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                    <FaSignOutAlt aria-hidden="true" className="text-base" />
                    Log out
                  </button>
                ) : (
                  <Link to={ROUTES.LOGIN} onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    <FaSignInAlt aria-hidden="true" className="text-base" />
                    Log in
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
    </header>
  );
};

export default Navbar;
<<<<<<< HEAD

//
// import { Link } from 'react-router-dom';
// import { FaShieldAlt, FaHome, FaBriefcase, FaSignInAlt } from 'react-icons/fa';

// const Navbar = () => {
//   return (
//     <header className="bg-gray-100 shadow-sm m-h-screen">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
//         {/* Logo */}
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
//             <FaShieldAlt className="text-white text-lg" />
//           </div>

//           <h1 className="text-2xl font-bold">
//             <span className="text-gray-900">Verify</span>
//             <span className="text-orange-500">Hire</span>
//           </h1>
//         </div>

//         {/* Navigation */}
//         <nav>
//           <ul className="flex items-center gap-10 text-gray-700 font-medium">
//             <li>
//               <Link
//                 to="/"
//                 className="flex items-center gap-2 hover:text-orange-500 transition"
//               >
//                 <FaHome />
//                 Home
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to="/Jobs"
//                 className="flex items-center gap-2 hover:text-orange-500 transition"
//               >
//                 <FaBriefcase />
//                 Jobs
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to="/login"
//                 className="flex items-center gap-2 hover:text-orange-500 transition"
//               >
//                 <FaSignInAlt />
//                 Log in
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
=======
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
