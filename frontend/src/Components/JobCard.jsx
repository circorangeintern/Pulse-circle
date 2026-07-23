import { FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle, FaFlag, FaChevronRight } from "react-icons/fa";

function StatusBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <FaCheckCircle size={11} />
        Verified Employer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <FaExclamationTriangle size={11} />
      Not Yet Verified
    </span>
  );
}

function JobCard({ job, onViewCompany, onReport }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
        <StatusBadge verified={job.verified} />
      </div>

      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
        <FaBuilding size={12} />
        {job.company}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <FaMapMarkerAlt size={11} />
          {job.location}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {job.type}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">{job.description}</p>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewCompany?.(job)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus-ring"
        >
          View company
          <FaChevronRight size={11} />
        </button>
        <button
          type="button"
          onClick={() => onReport?.(job)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 focus-ring"
        >
          <FaFlag size={12} />
          Report
        </button>
      </div>
    </article>
  );
}

export default JobCard;
