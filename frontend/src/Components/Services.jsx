import { FaShieldAlt, FaStar, FaFlag, FaWifi } from "react-icons/fa";

const services = [
  {
    icon: <FaShieldAlt className="text-green-600 text-lg" />,
    iconBg: "bg-green-50",
    title: "Verified Employers",
    desc: "Check if a company is admin- verified before you apply",
  },
  {
    icon: <FaStar className="text-yellow-600 text-lg" />,
    iconBg: "bg-yellow-50",
    title: "Community Reviews",
    desc: "Read real experiences from other job seekers. Share your own.",
  },
  {
    icon: <FaFlag className="text-red-500 text-lg" />,
    iconBg: "bg-red-50",
    title: "Report Scams",
    desc: "Spot a fake posting? Flag it in one tap and protect others.",
  },
  {
    icon: <FaWifi className="text-blue-500 text-lg" />,
    iconBg: "bg-blue-50",
    title: "Low-Data Friendly",
    desc: "Built for low-data environments — fast, simple, accessible.",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-[#1a1a2e] font-bold text-3xl sm:text-4xl mb-3">
            Why VerifyHire?
          </h2>
          <p className="text-gray-500 text-base">
            Everything you need to job hunt safely.
          </p>
        </div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-12">
          {services.map((service) => (
            <div key={service.title} className="flex flex-col gap-4">
              {/* Icon box */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${service.iconBg}`}>
                {service.icon}
              </div>
              {/* Text */}
              <div>
                <h3 className="text-[#1a1a2e] font-bold text-base mb-1">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
