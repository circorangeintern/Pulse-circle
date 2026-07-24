import { Link, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaSearch, FaBuilding, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth.js';

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="text-white text-lg" />
            </span>
            <span className="text-[#1a1a2e] font-bold text-2xl">
              Verify<span className="text-orange-500">Hire</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
            Join as a ...
          </h2>
          <p className="text-gray-400 text-base">
            Choose the account type that fits you best
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Job Seeker */}
          <button
            onClick={() => navigate('/signup/seeker')}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:border-orange-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
              <FaSearch className="text-orange-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
              Job Seeker
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Looking for your next opportunity? Browse verified jobs, read
              reviews, and apply with confidence.
            </p>
            <span className="flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
              Get Started <FaArrowRight />
            </span>
          </button>

          {/* Employer */}
          <button
            onClick={() => navigate('/signup/employer')}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:border-orange-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <FaBuilding className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
              Employer
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Represent your company and post job openings. Verify your
              business with your CAC registration number.
            </p>
            <span className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Register Company <FaArrowRight />
            </span>
          </button>
        </div>

        {/* Bottom link */}
        <p className="text-center text-sm text-gray-400 mt-10">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
