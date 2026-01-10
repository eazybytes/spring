import httpClient from "../config/httpClient";
import { API_ENDPOINTS } from "../config/api";

/**
 * Apply for a job
 * @param {number} jobId - The job ID
 * @param {string} coverLetter - Optional cover letter
 */
export const applyForJob = async (jobId, coverLetter = "") => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.APPLY_JOB, {
      jobId,
      coverLetter,
    });
    return response.data;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

/**
 * Withdraw an application
 * @param {number} jobId - The job ID
 */
export const withdrawApplication = async (jobId) => {
  try {
    await httpClient.delete(API_ENDPOINTS.WITHDRAW_APPLICATION(jobId));
  } catch (error) {
    console.error("Error withdrawing application:", error);
    throw error;
  }
};

/**
 * Get all applications for the current user
 */
export const getMyApplications = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.MY_APPLICATIONS);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

/**
 * Get all applied job IDs for the current user (lightweight)
 */
export const getAppliedJobIds = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.APPLIED_JOB_IDS);
    return response.data;
  } catch (error) {
    console.error("Error fetching applied job IDs:", error);
    throw error;
  }
};

/**
 * Check if user has applied for a job
 * @param {number} jobId - The job ID
 */
export const hasApplied = async (jobId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.CHECK_APPLIED(jobId));
    return response.data;
  } catch (error) {
    console.error("Error checking if applied:", error);
    return false;
  }
};

/**
 * Get all applications for a specific job (Employer)
 * @param {number} jobId - The job ID
 */
export const getApplicationsByJob = async (jobId) => {
  try {
    const response = await httpClient.get(
      API_ENDPOINTS.APPLICATIONS_BY_JOB(jobId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    throw error;
  }
};

/**
 * Get all applications for the employer's company
 */
export const getCompanyApplications = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.COMPANY_APPLICATIONS);
    return response.data;
  } catch (error) {
    console.error("Error fetching company applications:", error);
    throw error;
  }
};

/**
 * Update application status (Employer)
 * @param {number} applicationId - The application ID
 * @param {string} status - The new status
 * @param {string} notes - Optional notes
 */
export const updateApplicationStatus = async (
  applicationId,
  status,
  notes = ""
) => {
  try {
    const response = await httpClient.patch(API_ENDPOINTS.UPDATE_APPLICATION, {
      applicationId,
      status,
      notes,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};
