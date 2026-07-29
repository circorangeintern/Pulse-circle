<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useRef } from 'react';
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaMapMarkerAlt,
  FaIdCard,
<<<<<<< HEAD
} from 'react-icons/fa';
import AuthLayout from '../components/AuthLayout.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import GoogleButton from '../components/GoogleButton.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Divider from '../components/Divider.jsx';
import ValidationError from '../components/ValidationError.jsx';
=======
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaArrowLeft,
} from 'react-icons/fa';
import AuthLayout from '../Components/AuthLayout.jsx';
import InputField from '../Components/InputField.jsx';
import PasswordInput from '../Components/PasswordInput.jsx';
import GoogleButton from '../Components/GoogleButton.jsx';
import PrimaryButton from '../Components/PrimaryButton.jsx';
import Divider from '../Components/Divider.jsx';
import ValidationError from '../Components/ValidationError.jsx';
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
import { signupSchema } from '../validation/authSchemas.js';
import {
  signUpWithEmail,
  signInWithGoogle,
  sendVerificationCode,
  getAuthErrorMessage,
} from '../services/authService.js';
<<<<<<< HEAD
import { ROUTES } from '../utils/constants.js';

const ACCOUNT_TYPE_OPTIONS = [
  { value: 'user', label: 'User — looking for a job' },
  { value: 'employer', label: 'Employer — hiring talent' },
];

function Signup() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
=======
import { authApi } from '../services/api.js';
import { ROUTES } from '../utils/constants.js';

function Signup({ initialRole = 'user' }) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [cacVerifying, setCacVerifying] = useState(false);
  const [cacVerified, setCacVerified] = useState(false);
  const [cacError, setCacError] = useState('');
  const [cacCompanyName, setCacCompanyName] = useState('');
  const cacFieldRef = useRef(null);

  async function handleVerifyCAC(cacNumber, setFieldValue) {
    setCacError('');
    setCacVerified(false);
    setCacCompanyName('');

    if (!cacNumber || cacNumber.trim().length < 3) {
      setCacError('Please enter a valid CAC registration number');
      return;
    }

    setCacVerifying(true);
    try {
      const response = await authApi.verifyCAC({ cac_number: cacNumber.trim() });
      const data = response.data;
      if (data.is_valid) {
        setCacCompanyName(data.company_name);
        setCacVerified(true);
        setFieldValue('companyName', data.company_name);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setCacError(detail || 'CAC verification failed. Please check the number and try again.');
      setCacVerified(false);
    } finally {
      setCacVerifying(false);
    }
  }
>>>>>>> 0948f907775552d7842c98a19f372989e9207840

  async function handleSubmit(values, { setSubmitting, setFieldTouched }) {
    setFormError('');
    try {
      await signUpWithEmail(values);

<<<<<<< HEAD
      let warning = '';
      try {
        await sendVerificationCode(values.email);
=======
      let devCode = '';
      let warning = '';
      try {
        const resp = await sendVerificationCode(values.email);
        devCode = resp?.data?.dev_code || '';
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
      } catch (codeError) {
        warning =
          "We couldn't send your code automatically — use Resend on the next screen.";
      }

      navigate(ROUTES.VERIFY_EMAIL, {
        replace: true,
<<<<<<< HEAD
        state: { email: values.email, warning },
=======
        state: { email: values.email, warning, devCode },
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
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
<<<<<<< HEAD
      navigate(ROUTES.DASHBOARD, { replace: true });
=======
      navigate(ROUTES.JOBS, { replace: true });
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
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
<<<<<<< HEAD
=======
      wide={initialRole === 'employer'}
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
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
<<<<<<< HEAD
          role: 'user',
=======
          role: initialRole,
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
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
<<<<<<< HEAD
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
=======
              <div className="flex items-center gap-2 mb-4">
                <Link
                  to="/signup"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <FaArrowLeft size={14} />
                </Link>
                <span className="text-sm text-gray-500">Back to account type</span>
              </div>

              {!isEmployer && (
                <>
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
                </>
              )}
              <div className={isEmployer ? 'grid grid-cols-2 gap-3' : ''}>
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
              </div>
>>>>>>> 0948f907775552d7842c98a19f372989e9207840

              {isEmployer && (
                <div className="mb-2 mt-2 border-t border-gray-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Company details
                  </p>

<<<<<<< HEAD
=======
                  {/* CAC Verification */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      CAC Registration Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FaIdCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="cacNumber"
                          value={values.cacNumber}
                          onChange={(e) => {
                            handleChange(e);
                            setCacVerified(false);
                            setCacCompanyName('');
                            setCacError('');
                          }}
                          placeholder="e.g. RC123456"
                          disabled={values.noCac}
                          className={`w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm focus-ring ${
                            cacVerified ? 'border-green-300 bg-green-50' : 'border-gray-300'
                          } ${values.noCac ? 'bg-gray-100 text-gray-400' : ''}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVerifyCAC(values.cacNumber, setFieldValue)}
                        disabled={cacVerifying || !values.cacNumber || values.noCac}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors shrink-0"
                      >
                        {cacVerifying ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaSearch size={13} />
                        )}
                        Verify
                      </button>
                    </div>
                    {cacError && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <FaTimesCircle /> {cacError}
                      </p>
                    )}
                    {cacVerified && (
                      <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> Verified: {cacCompanyName}
                      </p>
                    )}
                  </div>

                  {/* Company Name - locked after CAC verification */}
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
                  <InputField
                    name="companyName"
                    type="text"
                    label="Company name"
<<<<<<< HEAD
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
=======
                    placeholder="Verified via CAC"
                    icon={<FaBuilding size={14} />}
                    autoComplete="organization"
                    disabled={true}
                  />

                  <div className="grid grid-cols-2 gap-3">
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
                  </div>
>>>>>>> 0948f907775552d7842c98a19f372989e9207840

                  <label className="flex items-start gap-2 mb-4 -mt-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      name="noCac"
                      checked={values.noCac}
                      onChange={(e) => {
                        handleChange(e);
<<<<<<< HEAD
                        if (e.target.checked) setFieldValue('cacNumber', '');
=======
                        if (e.target.checked) {
                          setFieldValue('cacNumber', '');
                          setCacVerified(false);
                          setCacCompanyName('');
                          setCacError('');
                        }
>>>>>>> 0948f907775552d7842c98a19f372989e9207840
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
