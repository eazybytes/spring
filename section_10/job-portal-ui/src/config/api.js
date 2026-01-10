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
  COMPANIES: "/companies/public",
  COMPANIES_ADMIN: "/companies/admin",
  COMPANIES_CREATE_ADMIN: "/companies/admin",
  DELETE_COMPANY_BY_ID: (id) => `/companies/${id}/admin`,
  UPDATE_COMPANY_BY_ID: (id) => `/companies/${id}/admin`,

  // Job endpoints (placeholder for future use)
  JOBS: "/jobs",
  JOB_BY_ID: (id) => `/jobs/${id}`,

  // Auth endpoints (placeholder for future use)
  LOGIN: "/auth/login/public",
  REGISTER: "/auth/register/public",
  LOGOUT: "/auth/logout",

  // User endpoints
  PROFILE: "/users/profile/jobseeker",
  PROFILE_PICTURE: "/users/profile/picture/jobseeker",
  PROFILE_RESUME: "/users/profile/resume/jobseeker",
  UPDATE_PROFILE: "/users/profile/jobseeker",

  // Contact endpoints
  CONTACTS: "/contacts/public",
  CONTACT_BY_ID: (id) => `/contacts/${id}`,
  ADMIN_CONTACTS: "/contacts/admin",
  ADMIN_CONTACTS_SORT: "/contacts/sort/admin",
  ADMIN_CONTACTS_PAGE: "/contacts/page/admin",
  UPDATE_CONTACT_STATUS: (id) => `/contacts/${id}/status/admin`,

  // CSRF token endpoint
  CSRF_TOKEN: "/csrf-token/public",

  // Admin User Management endpoints
  SEARCH_USER_BY_EMAIL: "/users/search/admin",
  ELEVATE_TO_EMPLOYER: (userId) => `/users/${userId}/role/employer/admin`,
  ASSIGN_COMPANY_TO_EMPLOYER: (userId, companyId) =>
    `/users/${userId}/company/${companyId}/admin`,

  // Employer Job Management endpoints
  EMPLOYER_JOBS: "/jobs/employer",
  POST_JOB: "/jobs/employer",
  UPDATE_JOB_STATUS: (jobId) => `/jobs/${jobId}/status/employer`,

  // Saved Jobs endpoints
  SAVED_JOBS: "/users/saved-jobs/jobseeker",
  SAVED_JOB_IDS: "/saved-jobs/ids",
  SAVE_UNSAVE_JOB: (jobId) => `/users/saved-jobs/${jobId}/jobseeker`,
  CHECK_JOB_SAVED: (jobId) => `/saved-jobs/check/${jobId}`,

  // Job Application endpoints
  JOB_APPLICATIONS: "/job-applications",
  APPLY_JOB: "/users/job-applications/jobseeker",
  WITHDRAW_APPLICATION: (jobId) => `/users/job-applications/${jobId}/jobseeker`,
  MY_APPLICATIONS: "/users/job-applications/jobseeker",
  APPLIED_JOB_IDS: "/job-applications/applied-job-ids",
  CHECK_APPLIED: (jobId) => `/job-applications/check/${jobId}`,
  APPLICATIONS_BY_JOB: (jobId) => `/jobs/applications/${jobId}/employer`,
  COMPANY_APPLICATIONS: "/job-applications/company-applications",
  UPDATE_APPLICATION: "/jobs/applications/employer",
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
