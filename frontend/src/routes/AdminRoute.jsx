import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { usersApi } from "../services/api.js";
import { ROUTES } from "../utils/constants.js";

function FullScreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-orange-500 animate-spin"
        aria-label="Loading"
      />
    </div>
  );
}

function AdminRoute({ children }) {
  const { user, loading: authLoading, isEmailVerified } = useAuth();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    usersApi
      .getMe()
      .then((res) => setRole(res.data.role))
      .catch(() => setRole(null))
      .finally(() => setRoleLoading(false));
  }, [user]);

  if (authLoading || roleLoading) return <FullScreenSpinner />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    return (
      <Navigate to={ROUTES.VERIFY_EMAIL} state={{ email: user.email }} replace />
    );
  }

  if (role !== "admin") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

export default AdminRoute;
