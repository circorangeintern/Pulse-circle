import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
import RoleSelect from '../pages/RoleSelect.jsx';
import Signup from '../pages/Signup.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import Jobs from '../pages/Jobs.jsx';
import CompanyDetail from '../pages/CompanyDetail.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import RecruiterDashboard from '../pages/RecruiterDashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

/** Redirects already-authenticated + verified users away from /login and /signup. */
function PublicOnlyRoute({ children }) {
  const { user, loading, isEmailVerified } = useAuth();
  if (loading) return null;
  if (user && isEmailVerified)
    return <Navigate to={ROUTES.JOBS} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page now owns "/" instead of redirecting straight to login. */}
      <Route path="/" element={<LandingPage />} />

      <Route path={ROUTES.JOBS} element={<Jobs />} />
      <Route path="/company/:id" element={<CompanyDetail />} />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route path="/signup" element={<RoleSelect />} />
      <Route
        path="/signup/seeker"
        element={
          <PublicOnlyRoute>
            <Signup initialRole="user" />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup/employer"
        element={
          <PublicOnlyRoute>
            <Signup initialRole="employer" />
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

      <Route
        path={ROUTES.ADMIN}
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.RECRUITER_DASHBOARD}
        element={
          <ProtectedRoute>
            <RecruiterDashboard />
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
