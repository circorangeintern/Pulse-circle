export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  JOBS: '/jobs',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  RECRUITER_DASHBOARD: '/dashboard/recruiter',
};

export const RESEND_COOLDOWN_SECONDS = 60;

// Values must match the ReportReason enum in the backend (app/models/report.py)
export const REPORT_REASONS = [
  { value: 'Scam', label: 'Scam' },
  { value: 'Fake company', label: 'Fake company' },
  { value: 'Suspicious contact', label: 'Suspicious contact' },
  { value: 'Too expensive', label: 'Too expensive' },
];
