import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHome, FaBriefcase, FaSignInAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="bg-gray-100 shadow-sm m-h-screen">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
            <FaShieldAlt className="text-white text-lg" />
          </div>

          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Verify</span>
            <span className="text-orange-500">Hire</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-10 text-gray-700 font-medium">
            <li>
              <Link
                to="/LandingPage"
                className="flex items-center gap-2 hover:text-orange-500 transition"
              >
                <FaHome />
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/Jobs"
                className="flex items-center gap-2 hover:text-orange-500 transition"
              >
                <FaBriefcase />
                Jobs
              </Link>
            </li>

            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 hover:text-orange-500 transition"
              >
                <FaSignInAlt />
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

// // import React from 'react'
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav>
//       <Link to="/LandingPage"> Home </Link>
//       <Link to="/Login"> Login </Link>
//     </nav>
//   );
// };

// export default Navbar;
