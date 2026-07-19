import { FaSearch, FaShieldAlt, FaFlag } from 'react-icons/fa';

const steps = [
  {
    icon: <FaSearch className="text-white text-xl" />,
    step: 'Step 1',
    title: 'Search for jobs',
    desc: 'Find work by title, company, or city. Filter verified only.',
  },
  {
    icon: <FaShieldAlt className="text-white text-xl" />,
    step: 'Step 2',
    title: 'Check & verify',
    desc: 'Look for the badge. Read reviews on the company profile.',
  },
  {
    icon: <FaFlag className="text-white text-xl" />,
    step: 'Step 3',
    title: 'Apply & report',
    desc: 'Apply with confidence. Report anything suspicious instantly.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[#1a1a2e] font-bold text-3xl sm:text-4xl mb-2">
            How it works
          </h2>
          <p className="text-gray-400 text-base">
            Three steps to a safer job search.
          </p>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-12" />

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {steps.map((step) => (
            <div key={step.step} className="flex flex-col items-center gap-3">
              {/* Icon circle */}
              <div className="w-14 h-14 rounded-full bg-[#1a1a2e] flex items-center justify-center mb-1">
                {step.icon}
              </div>

              {/* Step badge */}
              <span className="bg-orange-50 text-orange-500 text-xs font-semibold px-3 py-1 rounded-sm">
                {step.step}
              </span>

              {/* Title */}
              <h3 className="text-[#1a1a2e] font-bold text-base">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed max-w-55">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
