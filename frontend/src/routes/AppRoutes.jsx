import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
<<<<<<< HEAD
import Signup from '../pages/Signup.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import Jobs from '../pages/Jobs.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
=======
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
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

/** Redirects already-authenticated + verified users away from /login and /signup. */
function PublicOnlyRoute({ children }) {
  const { user, loading, isEmailVerified } = useAuth();
  if (loading) return null;
  if (user && isEmailVerified)
<<<<<<< HEAD
    return <Navigate to={ROUTES.DASHBOARD} replace />;
=======
    return <Navigate to={ROUTES.JOBS} replace />;
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page now owns "/" instead of redirecting straight to login. */}
      <Route path="/" element={<LandingPage />} />

      <Route path={ROUTES.JOBS} element={<Jobs />} />
<<<<<<< HEAD

      {/* <Route
        path={ROUTES.JOBS}
        element={
          <PublicOnlyRoute>
            <Jobs />
          </PublicOnlyRoute>
        }
      /> */}
=======
      <Route path="/company/:id" element={<CompanyDetail />} />
>>>>>>> 0948f907775552d7842c98a19f372989e9207840

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
<<<<<<< HEAD
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PublicOnlyRoute>
            <Signup />
=======
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
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
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

<<<<<<< HEAD
=======
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

>>>>>>> 0948f907775552d7842c98a19f372989e9207840
      {/* Unknown routes now fall back to the landing page rather than login,
          since "/" is a real public page now, not just a redirect stub. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
