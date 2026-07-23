import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import Jobs from '../pages/Jobs.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

/** Redirects already-authenticated + verified users away from /login and /signup. */
function PublicOnlyRoute({ children }) {
  const { user, loading, isEmailVerified } = useAuth();
  if (loading) return null;
  if (user && isEmailVerified)
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page now owns "/" instead of redirecting straight to login. */}
      <Route path="/" element={<LandingPage />} />

      <Route path={ROUTES.JOBS} element={<Jobs />} />

      {/* <Route
        path={ROUTES.JOBS}
        element={
          <PublicOnlyRoute>
            <Jobs />
          </PublicOnlyRoute>
        }
      /> */}

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      {/* Reachable whether or not the user is fully authenticated yet,
          since it's a required step between signup and the dashboard. */}
      <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes now fall back to the landing page rather than login,
          since "/" is a real public page now, not just a redirect stub. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
