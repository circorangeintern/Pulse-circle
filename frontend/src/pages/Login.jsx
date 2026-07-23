import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaSignInAlt, FaEnvelope } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout.jsx";
import InputField from "../components/InputField.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Divider from "../components/Divider.jsx";
import { loginSchema } from "../validation/authSchemas.js";
import { signInWithEmail, signInWithGoogle, getAuthErrorMessage } from "../services/authService.js";
import { ROUTES } from "../utils/constants.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || ROUTES.DASHBOARD;

  async function handleSubmit(values, { setSubmitting }) {
    setFormError("");
    try {
      await signInWithEmail(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setFormError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout
      icon={<FaSignInAlt />}
      title="Welcome back"
      subtitle="Log in to your VerifyHire account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.SIGNUP} className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </>
      }
    >
      <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />
      <Divider />

      {formError && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 animate-shake"
        >
          {formError}
        </div>
      )}

      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, handleChange }) => (
          <Form noValidate>
            <InputField
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              icon={<FaEnvelope size={14} />}
              autoComplete="email"
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-800">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput name="password" autoComplete="current-password" />
            </div>

            <label className="flex items-center gap-2 mb-5 select-none cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus-ring"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>

            <PrimaryButton loading={isSubmitting}>Log in</PrimaryButton>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}

export default Login;
