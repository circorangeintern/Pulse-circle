import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import JHero from '../Components/JHero.jsx';
import SearchBar from '../Components/SearchBar.jsx';
import JobCard from '../Components/JobCard.jsx';
import ReportModal from '../Components/ReportModal.jsx';
import { jobsApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = user && isEmailVerified;

  const verifiedOnly = searchParams.get('verified') === 'true';
  const query = searchParams.get('q') || '';

  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportJob, setReportJob] = useState(null); // job being reported

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    setError('');
    try {
      const response = await jobsApi.getAll();
      // Map backend response shape to what JobCard expects
      const mapped = response.data.map((job) => ({
        id: job.identifier,
        companyId: job.company_identifier,
        title: job.title,
        company: job.company?.name || 'Unknown',
        location: job.location || '',
        type: job.job_type || '',
        description: job.description || '',
        verified: job.company?.verified || false,
      }));
      setAllJobs(mapped);
    } catch (err) {
      setError('Failed to load jobs. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }

  function requireLogin() {
    navigate(ROUTES.LOGIN, { state: { from: location } });
  }

  function handleToggleVerified() {
    const next = new URLSearchParams(searchParams);
    if (verifiedOnly) {
      next.delete('verified');
    } else {
      next.set('verified', 'true');
    }
    setSearchParams(next);
  }

  function handleQueryChange(value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  }

  function handleViewCompany(job) {
    if (!user) {
      requireLogin();
      return;
    }
    navigate(`/company/${job.companyId}`);
  }

  function handleReport(job) {
    if (!user) {
      requireLogin();
      return;
    }
    setReportJob(job);
  }

  // Client-side filtering on the fetched list
  const filteredJobs = allJobs.filter((job) => {
    if (verifiedOnly && !job.verified) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <JHero />

        <div className="mt-6">
          <SearchBar
            query={query}
            onQueryChange={handleQueryChange}
            verifiedOnly={verifiedOnly}
            onToggleVerified={handleToggleVerified}
          />
        </div>

        {loading ? (
          <div className="mt-10 text-center py-16">
            <p className="text-sm text-gray-500">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="mt-10 text-center py-16">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewCompany={handleViewCompany}
                onReport={handleReport}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              No jobs match{' '}
              {verifiedOnly ? 'verified employers' : 'your search'} right now.
            </p>
          </div>
        )}
      </main>

      {/* Report Modal */}
      {reportJob && (
        <ReportModal
          job={reportJob}
          onClose={() => setReportJob(null)}
          onReported={() => setReportJob(null)}
        />
      )}
    </div>
  );
}

export default Jobs;
