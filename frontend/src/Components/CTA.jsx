import { Link } from 'react-router-dom';
import { FaShieldAlt, FaSearch } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';

export default function CTA() {
  return (
    <section className="bg-[#0f172a] py-20 px-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center">
          <FaShieldAlt className="text-white text-2xl" />
        </div>

        {/* Heading */}
        <h2 className="text-white font-bold text-3xl sm:text-4xl leading-tight">
          Start your job search with confidence
        </h2>

        {/* Subtext */}
        <p className="text-gray-300 text-base">
          Browse verified employers, report suspicious postings and find work
          that's legit
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            to="/jobs"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200"
          >
            <FaSearch className="text-sm" />
            Browse jobs
          </Link>

          <Link
            to="/signup"
            className="flex items-center gap-2 border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#0f172a] transition-colors duration-200"
          >
            Create account
            <MdArrowForward className="text-lg" />
          </Link>
        </div>
      </div>
    </section>
  );
}
