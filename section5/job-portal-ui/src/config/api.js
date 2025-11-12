/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URL for the backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// API Version Configuration
// Default version sent in Accept header for all REST API calls
// Format: application/vnd.eazyapp+json;v=1.0
export const DEFAULT_API_VERSION = "1.0";

// Supported API versions
export const SUPPORTED_API_VERSIONS = ["1.0", "2.0", "3.0"];

// Helper to generate Accept header value for a specific version
export const getAcceptHeader = (version = DEFAULT_API_VERSION) =>
  `application/vnd.eazyapp+json;v=${version}`;

// API Endpoints
export const API_ENDPOINTS = {
  // Company endpoints
  COMPANIES: "/companies",
  COMPANY_BY_ID: (id) => `/companies/${id}`,

  // Job endpoints (placeholder for future use)
  JOBS: "/jobs",
  JOB_BY_ID: (id) => `/jobs/${id}`,

  // Auth endpoints (placeholder for future use)
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",

  // User endpoints
  PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",

  // Contact endpoints
  CONTACTS: "/contacts",
  CONTACT_BY_ID: (id) => `/contacts/${id}`,
  ADMIN_CONTACTS: "/admin/contacts",
  ADMIN_CONTACTS_SORT: "/admin/contacts/sort",
  ADMIN_CONTACTS_PAGE: "/admin/contacts/page",
  UPDATE_CONTACT_STATUS: (id) => `/admin/contacts/${id}/status`,

  // CSRF token endpoint
  CSRF_TOKEN: "/csrf-token",

  // Admin User Management endpoints
  SEARCH_USER_BY_EMAIL: "/admin/users/search",
  ELEVATE_TO_EMPLOYER: (userId) => `/admin/users/${userId}/elevate-to-employer`,
  ASSIGN_COMPANY_TO_EMPLOYER: (userId) => `/admin/users/${userId}/assign-company`,

  // Employer Job Management endpoints
  EMPLOYER_JOBS: "/employer/jobs",
  POST_JOB: "/employer/jobs",
  UPDATE_JOB_STATUS: (jobId) => `/employer/jobs/${jobId}/status`,

  // Saved Jobs endpoints
  SAVED_JOBS: "/saved-jobs",
  SAVED_JOB_IDS: "/saved-jobs/ids",
  SAVE_JOB: (jobId) => `/saved-jobs/${jobId}`,
  UNSAVE_JOB: (jobId) => `/saved-jobs/${jobId}`,
  CHECK_JOB_SAVED: (jobId) => `/saved-jobs/check/${jobId}`,

  // Job Application endpoints
  JOB_APPLICATIONS: "/job-applications",
  APPLY_JOB: "/job-applications",
  WITHDRAW_APPLICATION: (jobId) => `/job-applications/${jobId}`,
  MY_APPLICATIONS: "/job-applications/my-applications",
  APPLIED_JOB_IDS: "/job-applications/applied-job-ids",
  CHECK_APPLIED: (jobId) => `/job-applications/check/${jobId}`,
  APPLICATIONS_BY_JOB: (jobId) => `/job-applications/job/${jobId}`,
  COMPANY_APPLICATIONS: "/job-applications/company-applications",
  UPDATE_APPLICATION_STATUS: (applicationId) => `/job-applications/${applicationId}/status`,
};

// HTTP Headers
export const API_HEADERS = {
  "Content-Type": "application/json",
};

// Request timeout (in milliseconds)
export const API_TIMEOUT = 30000;

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_HEADERS,
  API_TIMEOUT,
  DEFAULT_API_VERSION,
  SUPPORTED_API_VERSIONS,
};
