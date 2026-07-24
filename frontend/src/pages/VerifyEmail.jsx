import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaEnvelopeOpenText } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout.jsx";
import OtpInput from "../components/OtpInput.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { verifyEmailSchema } from "../validation/authSchemas.js";
import { verifyEmailCode, resendVerificationCode } from "../services/authService.js";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES, RESEND_COOLDOWN_SECONDS } from "../utils/constants.js";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, markEmailVerified } = useAuth();

  // The email is handed off via router state from the Signup page. If it's
  // missing (e.g. the user landed here directly), fall back to the signed-in
  // user's email, or send them back to sign up.
  const email = location.state?.email || user?.email || "";
  const [devCode, setDevCode] = useState(location.state?.devCode || "");

  const [formError, setFormError] = useState("");
  const [resendState, setResendState] = useState({
    loading: false,
    message: location.state?.warning || "",
    cooldown: 0,
  });

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.SIGNUP, { replace: true });
      return;
    }
    // Auto-send a code if we don't have one yet (e.g. redirected from login)
    if (!devCode) {
      handleResend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  // Countdown ticker for the resend cooldown.
  useEffect(() => {
    if (resendState.cooldown <= 0) return;
    const timer = setInterval(() => {
      setResendState((s) => ({ ...s, cooldown: Math.max(0, s.cooldown - 1) }));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendState.cooldown]);

  async function handleSubmit(values, { setSubmitting, setFieldError }) {
    setFormError("");
    try {
      await verifyEmailCode(email, values.code);
      markEmailVerified();
      navigate(ROUTES.JOBS, { replace: true });
    } catch (error) {
      const message = error.message || "That code didn't work. Please try again.";
      setFieldError("code", message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResendState((s) => ({ ...s, loading: true, message: "" }));
    try {
      const resp = await resendVerificationCode(email);
      const newCode = resp?.data?.dev_code || "";
      setResendState({
        loading: false,
        message: "A new code was sent to your email.",
        cooldown: RESEND_COOLDOWN_SECONDS,
      });
      if (newCode) setDevCode(newCode);
    } catch (error) {
      setResendState({
        loading: false,
        message: error.message || "Couldn't resend the code. Please try again.",
        cooldown: 0,
      });
    }
  }

  if (!email) return null;

  return (
    <AuthLayout
      icon={<FaEnvelopeOpenText />}
      title="Verify your email"
      subtitle={
        <>
          Enter the 6-digit code we sent to{" "}
          <span className="font-semibold text-gray-700">{email}</span>
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link to={ROUTES.SIGNUP} className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up again
          </Link>
        </>
      }
    >
      {devCode && (
        <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          <p className="font-semibold mb-0.5">🔧 Development mode</p>
          <p>
            Your verification code is: <span className="font-bold text-orange-600 text-base tracking-wider">{devCode}</span>
          </p>
        </div>
      )}

      {formError && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 animate-shake"
        >
          {formError}
        </div>
      )}

      <Formik
        initialValues={{ code: "" }}
        validationSchema={verifyEmailSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form noValidate>
            <OtpInput name="code" label="Verification code" />
            <PrimaryButton loading={isSubmitting} disabled={!isValid} className="mt-1">
              Verify email
            </PrimaryButton>
          </Form>
        )}
      </Formik>

      <div className="mt-5 text-center text-sm">
        {resendState.message && (
          <p className="mb-2 text-gray-500">{resendState.message}</p>
        )}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendState.loading || resendState.cooldown > 0}
          className="font-semibold text-brand-600 hover:text-brand-700 disabled:text-gray-400 disabled:cursor-not-allowed focus-ring rounded"
        >
          {resendState.cooldown > 0
            ? `Resend code in ${resendState.cooldown}s`
            : resendState.loading
            ? "Sending…"
            : "Resend code"}
        </button>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
