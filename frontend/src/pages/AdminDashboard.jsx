import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaBuilding, FaBriefcase, FaStar, FaFlag,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaShieldAlt,
  FaSignOutAlt, FaHome, FaSearch, FaBan, FaTrash,
  FaExclamationTriangle, FaChartBar, FaClipboardList,
  FaCheck, FaHourglassHalf,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth.js";
import { logout } from "../services/authService.js";
import { ROUTES } from "../utils/constants.js";
import {
  adminApi, usersApi, companiesApi, adminReportsApi,
  adminCompaniesApi,
} from "../services/api.js";

/* ───── helpers ───── */
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

/* ───── Stat Card ───── */
function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

/* ───── Sidebar ───── */
function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const tabs = [
    { key: "overview", label: "Overview", icon: <FaChartBar /> },
    { key: "companies", label: "Companies", icon: <FaBuilding /> },
    { key: "reports", label: "Reports", icon: <FaFlag /> },
    { key: "users", label: "Users", icon: <FaUsers /> },
  ];

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
          <FaShieldAlt className="text-white text-sm" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">
            <span className="text-gray-900">Verify</span>
            <span className="text-orange-500">Hire</span>
          </h1>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FaHome className="text-base" /> Back to site
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt className="text-base" /> Log out
        </button>
      </div>
    </aside>
  );
}

/* ───── Mobile Nav ───── */
function MobileNav({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "overview", label: "Overview", icon: <FaChartBar /> },
    { key: "companies", label: "Companies", icon: <FaBuilding /> },
    { key: "reports", label: "Reports", icon: <FaFlag /> },
    { key: "users", label: "Users", icon: <FaUsers /> },
  ];
  return (
    <div className="md:hidden flex overflow-x-auto gap-1 px-4 py-3 border-b border-gray-200 bg-white">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setActiveTab(t.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === t.key
              ? "bg-orange-50 text-orange-600"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Overview
   ═══════════════════════════════════════════════════════ */
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullTabSpinner />;

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900 mb-5">Platform Overview</h2>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FaUsers className="text-white" />} label="Total Users" value={stats?.total_users} color="bg-blue-500" />
        <StatCard icon={<FaBuilding className="text-white" />} label="Companies" value={stats?.total_companies} color="bg-purple-500" />
        <StatCard icon={<FaCheckCircle className="text-white" />} label="Verified" value={stats?.verified_companies} color="bg-green-500" />
        <StatCard icon={<FaBriefcase className="text-white" />} label="Jobs" value={stats?.total_jobs} color="bg-orange-500" />
        <StatCard icon={<FaStar className="text-white" />} label="Avg Rating" value={stats?.average_rating ?? "—"} color="bg-yellow-500" />
        <StatCard icon={<FaFlag className="text-white" />} label="Reports" value={stats?.total_reports} color="bg-red-500" />
        <StatCard icon={<FaHourglassHalf className="text-white" />} label="Pending Reports" value={stats?.pending_reports} color="bg-amber-500" />
        <StatCard icon={<FaUsers className="text-white" />} label="New (7d)" value={stats?.recent_signups} color="bg-teal-500" />
      </div>

      {/* Reports by reason */}
      {stats?.reports_by_reason?.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-bold text-gray-900 mb-4">Reports by Reason</h3>
          <div className="space-y-3">
            {stats.reports_by_reason.map((r) => {
              const max = Math.max(...stats.reports_by_reason.map((x) => x.count), 1);
              const pct = (r.count / max) * 100;
              return (
                <div key={r.reason}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{r.reason}</span>
                    <span className="text-gray-500">{r.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Companies
   ═══════════════════════════════════════════════════════ */
function CompaniesTab() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  function fetchCompanies() {
    setLoading(true);
    const params = search ? { search, limit: 100 } : { limit: 100 };
    companiesApi
      .getAll(params)
      .then((r) => setCompanies(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchCompanies(); }, []);

  async function handleToggleVerify(company) {
    try {
      await adminCompaniesApi.verify(company.identifier, { verified: !company.verified });
      fetchCompanies();
    } catch (e) { /* ignore */ }
  }

  async function handleDelete(company) {
    if (!window.confirm(`Delete "${company.name}" permanently?`)) return;
    try {
      await adminCompaniesApi.delete(company.identifier);
      fetchCompanies();
    } catch (e) { /* ignore */ }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">Companies</h2>
        <div className="relative max-w-xs w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchCompanies()}
            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <FullTabSpinner />
      ) : companies.length === 0 ? (
        <EmptyState icon={<FaBuilding />} text="No companies found." />
      ) : (
        <div className="space-y-3">
          {companies.map((c) => (
            <div key={c.identifier} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  c.verified ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {c.verified
                    ? <FaCheckCircle className="text-green-600" />
                    : <FaTimesCircle className="text-gray-400" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    {c.industry || "—"} &middot; {c.location || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  c.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {c.verified ? "Verified" : "Unverified"}
                </span>
                <button
                  onClick={() => handleToggleVerify(c)}
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  title={c.verified ? "Unverify" : "Verify"}
                >
                  {c.verified ? "Unverify" : "Verify"}
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Reports
   ═══════════════════════════════════════════════════════ */
function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  function fetchReports() {
    setLoading(true);
    const params = filter ? { status: filter, limit: 100 } : { limit: 100 };
    adminReportsApi.getAll(params).then((r) => setReports(r.data)).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { fetchReports(); }, [filter]);

  async function handleUpdateStatus(id, status) {
    try {
      await adminReportsApi.updateStatus(id, { status });
      fetchReports();
    } catch (e) { /* ignore */ }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">Reports</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-300 py-2 px-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <FullTabSpinner />
      ) : reports.length === 0 ? (
        <EmptyState icon={<FaFlag />} text="No reports found." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.identifier} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{r.reason}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[r.status] || "bg-gray-100 text-gray-600"}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.explanation && (
                    <p className="text-sm text-gray-600 mb-1">{r.explanation}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Job: {r.job_identifier?.slice(0, 8) || "—"} &middot; Reported {formatDateTime(r.created_date)}
                  </p>
                </div>
                {r.status === "Pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(r.identifier, "Reviewed")}
                      className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <FaCheck className="inline mr-1" /> Review
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(r.identifier, "Resolved")}
                      className="rounded-xl bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
                    >
                      <FaCheckCircle className="inline mr-1" /> Resolve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Users
   ═══════════════════════════════════════════════════════ */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchUsers() {
    setLoading(true);
    usersApi.getAll({ limit: 100 }).then((r) => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleToggleActive(user) {
    try {
      await usersApi.toggleActive(user.identifier);
      fetchUsers();
    } catch (e) { /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">Users</h2>
        <span className="text-sm text-gray-500">{users.length} total</span>
      </div>

      {loading ? (
        <FullTabSpinner />
      ) : users.length === 0 ? (
        <EmptyState icon={<FaUsers />} text="No users found." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.identifier} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.role === "admin" ? "bg-purple-100 text-purple-700" :
                      u.role === "recruiter" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.created_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        u.is_active
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-green-200 text-green-600 hover:bg-green-50"
                      }`}
                      title={u.is_active ? "Deactivate" : "Activate"}
                    >
                      {u.is_active ? <FaBan className="inline" /> : <FaCheckCircle className="inline" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ───── Shared small components ───── */
function FullTabSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <FaSpinner className="animate-spin text-orange-500 text-2xl" />
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center py-20 text-gray-400">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN: AdminDashboard
   ═══════════════════════════════════════════════════════ */
function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (desktop) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "companies" && <CompaniesTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "users" && <UsersTab />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
