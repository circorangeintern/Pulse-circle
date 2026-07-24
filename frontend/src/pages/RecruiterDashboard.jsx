import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding, FaBriefcase, FaStar, FaTrash, FaEdit,
  FaPlus, FaSignOutAlt, FaHome, FaSpinner, FaShieldAlt,
  FaSave, FaTimes, FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth.js";
import { logout } from "../services/authService.js";
import { recruiterApi, companiesApi } from "../services/api.js";
import { ROUTES } from "../utils/constants.js";

/* ───── Helpers ───── */
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

/* ───── Spinner ───── */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <FaSpinner className="animate-spin text-orange-500 text-2xl" />
    </div>
  );
}

/* ───── Stat Card ───── */
function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Company Profile
   ═══════════════════════════════════════════════════════ */
function CompanyTab({ company, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) setForm({ name: company.name, location: company.location || "", industry: company.industry || "", about: company.about || "" });
  }, [company]);

  if (!company) return <Spinner />;

  async function handleSave() {
    setSaving(true);
    try {
      const resp = await recruiterApi.updateMyCompany(form);
      onUpdate(resp.data);
      setEditing(false);
    } catch (e) { /* ignore */ }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">Company Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <FaEdit /> Edit
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-gray-100 text-gray-500" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Lagos, Nigeria"
                className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="e.g. Technology"
                className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
              <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={4}
                placeholder="Tell job seekers about your company…"
                className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300 transition-colors">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save changes
              </button>
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100">
                <FaBuilding className="text-orange-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${company.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {company.verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
            {company.location && <InfoRow label="Location" value={company.location} />}
            {company.industry && <InfoRow label="Industry" value={company.industry} />}
            {company.about && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">About</p>
                <p className="text-sm text-gray-700 leading-relaxed">{company.about}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 min-w-20 pt-0.5">{label}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Jobs
   ═══════════════════════════════════════════════════════ */
function JobsTab({ company }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({ title: "", location: "", job_type: "", description: "" });
  const [saving, setSaving] = useState(false);

  function fetchJobs() {
    setLoading(true);
    recruiterApi.getMyJobs().then((r) => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { fetchJobs(); }, []);

  function resetForm() {
    setForm({ title: "", location: "", job_type: "", description: "" });
    setShowForm(false);
    setEditJob(null);
  }

  function openEdit(job) {
    setForm({ title: job.title, location: job.location || "", job_type: job.job_type || "", description: job.description || "" });
    setEditJob(job);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editJob) {
        await recruiterApi.updateJob(editJob.identifier, form);
      } else {
        await recruiterApi.createJob({ ...form, company_identifier: company.identifier });
      }
      resetForm();
      fetchJobs();
    } catch (e) { /* ignore */ }
    finally { setSaving(false); }
  }

  async function handleDelete(jobId) {
    if (!window.confirm("Delete this job permanently?")) return;
    try {
      await recruiterApi.deleteJob(jobId);
      fetchJobs();
    } catch (e) { /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">My Jobs</h2>
        {company && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
            <FaPlus /> Post a job
          </button>
        )}
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <h3 className="font-bold text-gray-900 mb-4">{editJob ? "Edit Job" : "Post a New Job"}</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Job title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
              <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none">
                <option value="">Job type</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <textarea placeholder="Job description (responsibilities, requirements, etc.)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5}
              className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none" />
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300 transition-colors">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {editJob ? "Update" : "Post"} job
              </button>
              <button onClick={resetForm}
                className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : jobs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <FaBriefcase className="text-4xl mb-3" />
          <p className="text-sm font-medium">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.identifier} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {job.location || "Remote"} &middot; {job.job_type || "—"}
                  </p>
                  {job.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description.replace(/<[^>]*>/g, "").substring(0, 200)}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Posted {formatDate(job.created_date)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(job)}
                    className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    title="Edit"><FaEdit /></button>
                  <button onClick={() => handleDelete(job.identifier)}
                    className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Reviews
   ═══════════════════════════════════════════════════════ */
function ReviewsTab({ company }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    if (!company) return;
    Promise.all([
      companiesApi.getReviews(company.identifier).then((r) => setReviews(r.data)).catch(() => {}),
      companiesApi.getAverageRating(company.identifier).then((r) => setAvgRating(r.data?.average_rating)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [company]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">Reviews</h2>
        {avgRating !== null && (
          <div className="flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-700">
            <FaStar className="text-yellow-500" /> {Number(avgRating).toFixed(1)}
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <FaStar className="text-4xl mb-3" />
          <p className="text-sm font-medium">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.identifier} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar key={i} className={i < r.rating ? "text-yellow-400 text-sm" : "text-gray-200 text-sm"} />
                ))}
              </div>
              {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
              <p className="text-xs text-gray-400 mt-2">{formatDate(r.created_date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN: RecruiterDashboard
   ═══════════════════════════════════════════════════════ */
function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("company");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recruiterApi.getMyCompany().then((r) => setCompany(r.data)).catch(() => navigate(ROUTES.JOBS)).finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FaSpinner className="animate-spin text-orange-500 text-3xl" />
    </div>
  );

  const tabs = [
    { key: "company", label: "Company", icon: <FaBuilding /> },
    { key: "jobs", label: "Jobs", icon: <FaBriefcase /> },
    { key: "reviews", label: "Reviews", icon: <FaStar /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <FaShieldAlt className="text-white text-sm" />
            </div>
            <h1 className="text-lg font-bold">
              <span className="text-gray-900">Verify</span>
              <span className="text-orange-500">Hire</span>
              <span className="text-gray-400 font-medium text-sm ml-2">Recruiter</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-gray-500 hover:text-orange-500 transition-colors"><FaHome /></a>
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 transition-colors"><FaSignOutAlt /></button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "company" && <CompanyTab company={company} onUpdate={setCompany} />}
        {activeTab === "jobs" && <JobsTab company={company} />}
        {activeTab === "reviews" && <ReviewsTab company={company} />}
      </main>
    </div>
  );
}

export default RecruiterDashboard;
