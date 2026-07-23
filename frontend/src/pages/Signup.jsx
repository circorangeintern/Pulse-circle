import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaMapMarkerAlt,
  FaIdCard,
} from 'react-icons/fa';
import AuthLayout from '../components/AuthLayout.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import GoogleButton from '../components/GoogleButton.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Divider from '../components/Divider.jsx';
import ValidationError from '../components/ValidationError.jsx';
import { signupSchema } from '../validation/authSchemas.js';
import {
  signUpWithEmail,
  signInWithGoogle,
  sendVerificationCode,
  getAuthErrorMessage,
} from '../services/authService.js';
import { ROUTES } from '../utils/constants.js';

const ACCOUNT_TYPE_OPTIONS = [
  { value: 'user', label: 'User — looking for a job' },
  { value: 'employer', label: 'Employer — hiring talent' },
];

function Signup() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(values, { setSubmitting, setFieldTouched }) {
    setFormError('');
    try {
      await signUpWithEmail(values);

      let warning = '';
      try {
        await sendVerificationCode(values.email);
      } catch (codeError) {
        warning =
          "We couldn't send your code automatically — use Resend on the next screen.";
      }

      navigate(ROUTES.VERIFY_EMAIL, {
        replace: true,
        state: { email: values.email, warning },
      });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
      setSubmitting(false);
      return;
    }
    setFieldTouched('agree', false);
  }

  async function handleGoogleSignIn() {
    setFormError('');
    setGoogleLoading(true);
    try {
      // Google accounts are already email-verified, so we skip the code step.
      await signInWithGoogle();
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout
      icon={<FaUserPlus />}
      title="Create your account"
      subtitle="Sign up to get started with VerifyHire"
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Log in
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
        initialValues={{
          role: 'user',
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agree: false,
          companyName: '',
          companyEmail: '',
          companyAddress: '',
          cacNumber: '',
          noCac: false,
        }}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          values,
          handleChange,
          setFieldValue,
          touched,
          errors,
        }) => {
          const isEmployer = values.role === 'employer';

          return (
            <Form noValidate>
              <SelectField
                name="role"
                label="I am signing up as"
                options={ACCOUNT_TYPE_OPTIONS}
              />

              <InputField
                name="fullName"
                type="text"
                label="Full name"
                placeholder="Jane Doe"
                icon={<FaUser size={14} />}
                autoComplete="name"
              />
              <InputField
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                icon={<FaEnvelope size={14} />}
                autoComplete="email"
              />
              <PasswordInput
                name="password"
                label="Password"
                autoComplete="new-password"
              />
              <PasswordInput
                name="confirmPassword"
                label="Confirm password"
                autoComplete="new-password"
              />

              {isEmployer && (
                <div className="mb-2 mt-2 border-t border-gray-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Company details
                  </p>

                  <InputField
                    name="companyName"
                    type="text"
                    label="Company name"
                    placeholder="Acme Technologies Ltd"
                    icon={<FaBuilding size={14} />}
                    autoComplete="organization"
                  />
                  <InputField
                    name="companyEmail"
                    type="email"
                    label="Company email"
                    placeholder="hr@acme.com"
                    icon={<FaEnvelope size={14} />}
                    autoComplete="email"
                  />
                  <InputField
                    name="companyAddress"
                    type="text"
                    label="Company address"
                    placeholder="12 Adeola Odeku St, Victoria Island, Lagos"
                    icon={<FaMapMarkerAlt size={14} />}
                    autoComplete="street-address"
                  />

                  <InputField
                    name="cacNumber"
                    type="text"
                    label="CAC number"
                    placeholder="RC1234567"
                    icon={<FaIdCard size={14} />}
                    disabled={values.noCac}
                  />

                  <label className="flex items-start gap-2 mb-4 -mt-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      name="noCac"
                      checked={values.noCac}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.checked) setFieldValue('cacNumber', '');
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus-ring"
                    />
                    <span className="text-sm text-gray-600">
                      My company doesn&apos;t have a CAC number yet
                    </span>
                  </label>
                </div>
              )}

              <label className="flex items-start gap-2 mb-5 select-none cursor-pointer">
                <input
                  type="checkbox"
                  name="agree"
                  checked={values.agree}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus-ring"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link
                    to="#"
                    className="font-medium text-brand-600 hover:text-brand-700"
                  >
                    Terms &amp; Conditions
                  </Link>
                </span>
              </label>
              {touched.agree && errors.agree && (
                <ValidationError>{errors.agree}</ValidationError>
              )}

              <PrimaryButton loading={isSubmitting} className="mt-1">
                {isEmployer ? 'Create employer account' : 'Create account'}
              </PrimaryButton>
            </Form>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}

export default Signup;
