function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function PrimaryButton({ children, loading, disabled, type = "submit", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white
        transition-all hover:bg-gray-800 active:scale-[0.99]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        focus-ring"
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export default PrimaryButton;
