import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../utils/constants.js";

function FullScreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-brand-500 animate-spin"
        aria-label="Loading"
      />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading, isEmailVerified } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenSpinner />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    return (
      <Navigate to={ROUTES.VERIFY_EMAIL} state={{ email: user.email }} replace />
    );
  }

  return children;
}

export default ProtectedRoute;
