/**
 * Shared shell for every auth screen: centered icon badge, heading,
 * subtitle, and a bordered card that holds the form content.
 */
function AuthLayout({ icon, title, subtitle, children, footer, wide }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 sm:py-16">
      <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-md'} animate-fade-in`}>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl mb-5 shadow-sm">
            {icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm sm:text-base text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-7">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-gray-500">{footer}</p>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;
