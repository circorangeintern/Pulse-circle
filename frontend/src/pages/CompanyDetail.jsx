import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShieldAlt, FaStar, FaMapMarkerAlt, FaIndustry, FaBriefcase, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';
import { companiesApi, jobsApi } from '../services/api.js';

/** Converts markdown-style rich text (## headers, bullet points, **bold**) to HTML */
function renderRichText(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inList = false;

  for (let line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 class="text-base font-bold text-gray-900 mt-5 mb-2">${trimmed.replace('## ', '')}</h3>`;
    } else if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul class="list-disc pl-5 space-y-1 mb-3">'; inList = true; }
      const bolded = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html += `<li class="text-sm text-gray-600 leading-relaxed">${bolded.replace('- ', '')}</li>`;
    } else if (trimmed === '') {
      if (inList) { html += '</ul>'; inList = false; }
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      const bolded = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html += `<p class="text-sm text-gray-600 leading-relaxed mb-2">${bolded}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompany();
  }, [id]);

  async function fetchCompany() {
    setLoading(true);
    setError('');
    try {
      const [companyRes, reviewsRes, ratingRes, jobsRes] = await Promise.all([
        companiesApi.getById(id),
        companiesApi.getReviews(id),
        companiesApi.getAverageRating(id),
        jobsApi.getAll({ company_id: id }),
      ]);
      setCompany(companyRes.data);
      setReviews(reviewsRes.data);
      setRating(ratingRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      setError('Company not found.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-gray-500">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-red-500 mb-4">{error || 'Company not found'}</p>
          <Link to="/jobs" className="text-orange-500 hover:text-orange-600 font-medium underline">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Back link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6"
        >
          <FaArrowLeft size={12} />
          Back to jobs
        </Link>

        {/* Company Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shrink-0">
                <FaShieldAlt size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900">{company.name}</h1>
                  {company.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <FaCheckCircle size={11} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <FaExclamationTriangle size={11} />
                      Not Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                  {company.location && (
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt size={12} />
                      {company.location}
                    </span>
                  )}
                  {company.industry && (
                    <span className="flex items-center gap-1.5">
                      <FaIndustry size={12} />
                      {company.industry}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex flex-col items-center gap-1 rounded-xl bg-orange-50 px-4 py-3">
                <div className="flex items-center gap-1">
                  <FaStar className="text-orange-500" size={16} />
                  <span className="text-lg font-bold text-gray-900">{rating.average_rating}</span>
                </div>
                <span className="text-xs text-gray-500">{rating.total_reviews} review{rating.total_reviews !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* About */}
          {company.about && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">About</h2>
              <p className="text-sm leading-relaxed text-gray-600">{company.about}</p>
            </div>
          )}
        </div>

        {/* Jobs at this company */}
        {jobs.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Open Positions ({jobs.length})
            </h2>
            <div className="space-y-5">
              {jobs.map((job) => (
                <div key={job.identifier} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt size={12} />
                            {job.location}
                          </span>
                        )}
                        {job.job_type && (
                          <span className="flex items-center gap-1">
                            <FaClock size={12} />
                            {job.job_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: renderRichText(job.description) }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-10 text-center">
              <p className="text-sm text-gray-500">No reviews yet for this company.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.identifier} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={13}
                          className={star <= review.rating ? 'text-orange-500' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CompanyDetail;
