import axios from "axios";
import { auth } from "../firebase/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current Firebase ID token to every outgoing request, when available.
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so UI code can rely on a single shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(detail));
  }
);

// ── Jobs ──
export const jobsApi = {
  getAll: (params) => api.get("/jobs/", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
};

// ── Companies ──
export const companiesApi = {
  getAll: (params) => api.get("/companies/", { params }),
  getById: (id) => api.get(`/companies/${id}`),
  getReviews: (id) => api.get(`/companies/${id}/reviews`),
  getAverageRating: (id) => api.get(`/companies/${id}/average-rating`),
};

// ── Reports ──
export const reportsApi = {
  create: (data) => api.post("/reports/", data),
};

// ── Auth ──
export const authApi = {
  sendCode: (email) => api.post("/auth/send-code", { email }),
  verifyCode: (email, code) => api.post("/auth/verify-code", { email, code }),
  resendCode: (email) => api.post("/auth/resend-code", { email }),
  verifyCAC: (data) => api.post("/auth/verify-cac", data),
};

// ── Users ──
export const usersApi = {
  getMe: () => api.get("/users/me"),
  getAll: (params) => api.get("/users/", { params }),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
};

// ── Admin ──
export const adminApi = {
  getStats: () => api.get("/admin/stats"),
};

// ── Reports (admin) ──
export const adminReportsApi = {
  getPending: () => api.get("/reports/admin/pending"),
  getAll: (params) => api.get("/reports/admin/all", { params }),
  updateStatus: (id, data) => api.patch(`/reports/admin/${id}`, data),
  getStats: () => api.get("/reports/admin/stats"),
};

// ── Companies (admin) ──
export const adminCompaniesApi = {
  verify: (id, data) => api.patch(`/companies/${id}/verify`, data),
  update: (id, data) => api.patch(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

// ── Recruiter ──
export const recruiterApi = {
  getMyCompany: () => api.get("/companies/my"),
  updateMyCompany: (data) => api.patch("/companies/my", data),
  getMyJobs: () => api.get("/jobs/recruiter/my"),
  createJob: (data) => api.post("/jobs/recruiter", data),
  updateJob: (id, data) => api.put(`/jobs/recruiter/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/recruiter/${id}`),
};

export default api;
