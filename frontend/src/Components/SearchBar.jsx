import { FaSearch, FaShieldAlt } from "react-icons/fa";

function SearchBar({ query, onQueryChange, verifiedOnly, onToggleVerified }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
          <FaSearch size={14} />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search job, company or city"
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus-ring"
        />
      </div>

      <button
        type="button"
        onClick={onToggleVerified}
        aria-pressed={verifiedOnly}
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-ring
          ${verifiedOnly ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-900 text-white hover:bg-gray-800"}`}
      >
        <FaShieldAlt size={14} />
        Verified only
      </button>
    </div>
  );
}

export default SearchBar;
