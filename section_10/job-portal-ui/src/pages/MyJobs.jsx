import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useJobsData } from "../contexts/JobsDataContext";
import httpClient from "../config/httpClient";
import { API_ENDPOINTS } from "../config/api";
import { transformJob } from "../services/companyService";

const MyJobs = () => {
  const { theme } = useTheme();
  const { user, isEmployer, isAuthenticated } = useAuth();
  const { forceRefresh } = useJobsData();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isEmployer) {
      fetchJobs();
    }
  }, [isAuthenticated, isEmployer]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await httpClient.get(API_ENDPOINTS.EMPLOYER_JOBS);
      const jobsData = response.data || [];

      // Transform jobs to match frontend structure
      const transformedJobs = jobsData.map(job => transformJob(job));
      setJobs(transformedJobs);

      // Extract company info from first job (all jobs belong to same company)
      if (jobsData.length > 0) {
        setCompanyInfo({
          id: jobsData[0].companyId,
          name: jobsData[0].companyName,
          logo: jobsData[0].companyLogo,
        });
      }

      // Also refresh the global jobs cache so JobDetail page can find newly created jobs
      await forceRefresh();
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (jobId, newStatus) => {
    // Show confirmation modal
    setPendingStatusChange({ jobId, newStatus });
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { jobId, newStatus } = pendingStatusChange;

    try {
      setUpdatingJobId(jobId);
      setError("");
      setSuccess("");
      setShowConfirmModal(false);

      const response = await httpClient.patch(
        API_ENDPOINTS.UPDATE_JOB_STATUS(jobId),
        {
          status: newStatus,
        }
      );

      // Update the job in the local state
      setJobs(jobs.map((job) => (job.id === jobId ? transformJob(response.data) : job)));

      setSuccess(`Job status updated to ${newStatus}`);
      setTimeout(() => setSuccess(""), 3000);

      setPendingStatusChange(null);
    } catch (err) {
      console.error("Error updating job status:", err);
      setError(err.response?.data?.message || "Failed to update job status");
    } finally {
      setUpdatingJobId(null);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  const formatSalary = (min, max, currency = "USD") => {
    return `${currency} ${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(
      0
    )}k`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "CLOSED":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "DRAFT":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  if (!isAuthenticated || !isEmployer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You must be logged in as an employer to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Posted Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your job postings and update their status
          </p>
        </div>

        {/* Company Info */}
        {companyInfo && (
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                {companyInfo.logo ? (
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {companyInfo.name?.charAt(0) || "C"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                  {companyInfo.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Company Jobs Dashboard • {jobs.length}{" "}
                  {jobs.length === 1 ? "Job" : "Jobs"} Posted
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No jobs posted yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by posting your first job to attract talented candidates.
              </p>
              <Link
                to="/employer/post-job"
                className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Post a Job
              </Link>
            </div>
          </div>
        ) : (
          /* Jobs Table */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Applicants
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative"
                    >
                      {/* Job Title */}
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {job.category}
                          </p>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {job.location}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded font-medium w-fit">
                            {job.workType}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded font-medium w-fit">
                            {job.experienceLevel}
                          </span>
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                          {formatSalary(
                            job.salary?.min,
                            job.salary?.max,
                            job.salary?.currency
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          per {job.salary?.period}
                        </div>
                      </td>

                      {/* Applicants */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-primary-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {job.applicationsCount || 0}
                          </span>
                        </div>
                      </td>

                      {/* Posted */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {getTimeAgo(job.postedDate)}
                        </div>
                      </td>

                      {/* Status Buttons */}
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStatusChange(job.id, "ACTIVE")}
                            disabled={
                              updatingJobId === job.id ||
                              job.status === "ACTIVE"
                            }
                            title="Set to Active"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              job.status === "ACTIVE"
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            A
                          </button>
                          <button
                            onClick={() => handleStatusChange(job.id, "CLOSED")}
                            disabled={
                              updatingJobId === job.id ||
                              job.status === "CLOSED"
                            }
                            title="Set to Closed"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              job.status === "CLOSED"
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            C
                          </button>
                          <button
                            onClick={() => handleStatusChange(job.id, "DRAFT")}
                            disabled={
                              updatingJobId === job.id || job.status === "DRAFT"
                            }
                            title="Set to Draft"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              job.status === "DRAFT"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            D
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/job-applicants/${job.id}`}
                            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-semibold transition-colors"
                            title="View Applicants"
                          >
                            Applicants
                          </Link>
                          <Link
                            to={`/jobs/${job.id}`}
                            state={{ job }}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 rounded text-xs font-semibold transition-colors"
                            title="View Job Details"
                          >
                            View
                          </Link>
                        </div>
                      </td>

                      {/* Loading Overlay for Row */}
                      {updatingJobId === job.id && (
                        <td
                          colSpan="8"
                          className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                        >
                          <div className="flex items-center justify-center h-full">
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Updating...
                              </span>
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && pendingStatusChange && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                  Confirm Status Change
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Are you sure you want to change this job status to{" "}
                  <span
                    className={`font-bold ${
                      pendingStatusChange.newStatus === "ACTIVE"
                        ? "text-green-600 dark:text-green-400"
                        : pendingStatusChange.newStatus === "CLOSED"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {pendingStatusChange.newStatus}
                  </span>
                  ?
                </p>
                {pendingStatusChange.newStatus === "CLOSED" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">
                    Closing this job will stop accepting new applications.
                  </p>
                )}
                {pendingStatusChange.newStatus === "DRAFT" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">
                    Setting to draft will hide this job from job seekers.
                  </p>
                )}
                {pendingStatusChange.newStatus === "ACTIVE" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">
                    Activating this job will make it visible to job seekers.
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelStatusChange}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-white ${
                    pendingStatusChange.newStatus === "ACTIVE"
                      ? "bg-green-600 hover:bg-green-700"
                      : pendingStatusChange.newStatus === "CLOSED"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  Yes, Change Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
