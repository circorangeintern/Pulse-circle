import { useState } from 'react';
import { FaFlag, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { reportsApi } from '../services/api.js';
import { REPORT_REASONS } from '../utils/constants.js';

function ReportModal({ job, onClose, onReported }) {
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason for reporting');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await reportsApi.create({
        job_identifier: job.id,
        reason: reason,
        explanation: explanation || undefined,
      });
      setSuccess(true);
      setTimeout(() => onReported?.(), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <FaFlag className="text-red-500 text-sm" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Report Job</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <FaCheckCircle className="text-green-500 text-4xl mb-3" />
            <p className="font-semibold text-gray-900">Report submitted</p>
            <p className="text-sm text-gray-500 mt-1">
              Thank you. Our team will review this job posting.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 mb-4">
              Reporting: <span className="font-medium text-gray-900">{job.title}</span> at{' '}
              <span className="font-medium text-gray-900">{job.company}</span>
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus-ring bg-white"
              >
                <option value="">Select a reason...</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional details <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Tell us more about why this job posting is suspicious..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus-ring resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:bg-red-300 focus-ring"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaFlag />
                  Submit Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportModal;
