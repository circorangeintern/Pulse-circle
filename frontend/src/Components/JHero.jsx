import { FaShieldAlt } from 'react-icons/fa';

function JHero() {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-950 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <div>
        <span className="inline-flex items-center gap-2 bg-slate-600/50 text-gray-200 px-4 py-2 rounded-full text-sm mb-8">
          <FaShieldAlt size={10} className="text-orange-400 text-xs" />
          Apply with confidence
        </span>
        <h1 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Find real jobs. Avoid the scams.
        </h1>
      </div>
      <p className="max-w-md p-5 text-xs text-orange-400 sm:text-sm">
        Check if an employer is verified and report anything suspicious.
      </p>
    </div>
  );
}

export default JHero;
