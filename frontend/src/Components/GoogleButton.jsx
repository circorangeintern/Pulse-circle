import { FcGoogle } from "react-icons/fc";

function GoogleButton({ onClick, loading, disabled, children = "Continue with Google" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700
        transition-colors hover:bg-gray-50 active:scale-[0.99]
        disabled:opacity-60 disabled:cursor-not-allowed
        focus-ring"
    >
      <FcGoogle size={18} />
      {loading ? "Connecting…" : children}
    </button>
  );
}

export default GoogleButton;
