import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";
import { useJobsData } from "../contexts/JobsDataContext";
import * as jobApplicationService from "../services/jobApplicationService";

const JobApplicants = () => {
  const { jobId } = useParams();
  const { getJobById } = useJobsData();
  const { isEmployer, isAuthenticated, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showProfileModal || showContactModal) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [showProfileModal, showContactModal]);

  useEffect(() => {
    const loadJobAndApplications = async () => {
      if (!jobId || !isEmployer) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get job details from JobsDataContext
        const foundJob = getJobById(jobId);
        setJob(foundJob);

        // Fetch applications from backend
        const applicationsData =
          await jobApplicationService.getApplicationsByJob(jobId);

        // Transform backend data to match frontend format
        const transformedApplications = applicationsData.map((app) => {
          const profile = app.userProfile;

          // Helper function to convert Java byte array to base64
          const byteArrayToBase64 = (byteArray) => {
            if (!byteArray) return null;

            // If it's already a string (base64 or data URL), return it
            if (typeof byteArray === "string") {
              return byteArray;
            }

            // If it's not an array, log and return null
            if (!Array.isArray(byteArray)) {
              console.warn(
                "[JobApplicants] Expected array but got:",
                typeof byteArray,
                byteArray
              );
              return null;
            }

            if (byteArray.length === 0) return null;

            try {
              // Java bytes are signed (-128 to 127), convert to unsigned (0 to 255)
              const bytes = new Uint8Array(byteArray.map((b) => b & 0xff));

              // Convert to binary string
              let binary = "";
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }

              // Convert to base64
              return btoa(binary);
            } catch (error) {
              console.error(
                "[JobApplicants] Error converting byte array:",
                error
              );
              return null;
            }
          };

          // Convert byte array resume to base64 if exists
          let resumeBase64 = null;
          if (profile?.resume) {
            const base64String = byteArrayToBase64(profile.resume);
            if (base64String) {
              // If it already has data URL prefix, use as is
              if (base64String.startsWith("data:")) {
                resumeBase64 = base64String;
              } else {
                resumeBase64 = `data:${
                  profile.resumeType || "application/pdf"
                };base64,${base64String}`;
              }
            }
          }

          // Convert byte array profile picture to base64 if exists
          let profilePictureBase64 = null;
          if (profile?.profilePicture) {
            const base64String = byteArrayToBase64(profile.profilePicture);
            if (base64String) {
              // If it already has data URL prefix, use as is
              if (base64String.startsWith("data:")) {
                profilePictureBase64 = base64String;
              } else {
                profilePictureBase64 = `data:${
                  profile.profilePictureType || "image/jpeg"
                };base64,${base64String}`;
              }
            }
          }

          return {
            applicationId: app.id,
            applicant: {
              name: app.userName,
              email: app.userEmail,
              title: profile?.jobTitle || "Not specified",
              phone: app.userMobileNumber || "Not provided",
              location: profile?.location || "Not specified",
              bio: profile?.professionalBio || "No bio available",
              experience: profile?.experienceLevel || "No experience provided",
              resume: resumeBase64,
              profileImage: profilePictureBase64,
              portfolio: profile?.portfolioWebsite || null,
              appliedAt: app.appliedAt,
              status: app.status || "PENDING",
            },
          };
        });

        setApplications(transformedApplications);
      } catch (error) {
        console.error("[JobApplicants] Error loading job applications:", error);
        showNotification("Failed to load applications", "error");
      } finally {
        setLoading(false);
      }
    };

    loadJobAndApplications();
  }, [jobId, isEmployer, getJobById]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await jobApplicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? { ...app, applicant: { ...app.applicant, status: newStatus } }
            : app
        )
      );

      showNotification("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating application status:", error);
      showNotification("Failed to update application status", "error");
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Interview":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Hired":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.applicant.status.toLowerCase().replace(" ", "") === filter;
  });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter((app) => app.applicant.status === "Applied")
      .length,
    inreview: applications.filter((app) => app.applicant.status === "In Review")
      .length,
    interview: applications.filter(
      (app) => app.applicant.status === "Interview"
    ).length,
    hired: applications.filter((app) => app.applicant.status === "Hired")
      .length,
    rejected: applications.filter((app) => app.applicant.status === "Rejected")
      .length,
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isEmployer) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center px-4 py-12 relative">
        <div className="text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {!isAuthenticated ? "Please Log In" : "Access Denied"}
          </h2>
          <p className="text-gray-600 mb-6">
            {!isAuthenticated
              ? "You need to be logged in to view job applicants."
              : "This page is only available for employers."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center px-4 py-12 relative">
        <div className="text-center">
          <div className="text-6xl mb-6">❓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link
            to="/employer/jobs"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-primary-200/30 dark:from-purple-900/20 dark:to-primary-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/employer/jobs"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-4 inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to My Jobs
            </Link>
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 dark:from-primary-400 dark:via-purple-400 dark:to-primary-300 bg-clip-text text-transparent mb-2">
              Job Applicants
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {job.title} at {job.company}
            </p>
            <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 space-x-4">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </span>
              <span>•</span>
              <span>{job.jobType}</span>
              <span>•</span>
              <span>Posted {getTimeAgo(job.postedDate)}</span>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                notification.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {notification.type === "success" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L12.732 4.5c-.77-.833-2.186-.833-2.954 0L2.857 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  )}
                </svg>
                {notification.message}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Applications" },
                { key: "applied", label: "Applied" },
                { key: "inreview", label: "In Review" },
                { key: "interview", label: "Interview" },
                { key: "hired", label: "Hired" },
                { key: "rejected", label: "Rejected" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    filter === key
                      ? "bg-primary-600 dark:bg-primary-700 text-white"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } border border-white/20 dark:border-gray-700/20`}
                >
                  {label} ({statusCounts[key]})
                </button>
              ))}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-12 text-center">
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No Applications Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Your job posting is live! Applications will appear here once
                candidates start applying for this position.
              </p>
              <Link
                to={`/jobs/${job.id}`}
                className="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
              >
                View Job Posting
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-12 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No Applications Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No applications match the selected filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredApplications
                .sort(
                  (a, b) =>
                    new Date(b.applicant.appliedAt) -
                    new Date(a.applicant.appliedAt)
                )
                .map((application) => (
                  <div
                    key={application.applicationId}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {application.applicant.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {application.applicant.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {application.applicant.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                                {application.applicant.email}
                              </p>
                              <div className="text-sm text-gray-500 dark:text-gray-500">
                                Applied{" "}
                                {getTimeAgo(application.applicant.appliedAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              application.applicant.status
                            )}`}
                          >
                            {application.applicant.status}
                          </span>
                        </div>
                      </div>

                      <div className="lg:ml-8 lg:text-right">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Update Status
                          </label>
                          <select
                            value={application.applicant.status}
                            onChange={(e) =>
                              handleStatusChange(
                                application.applicationId,
                                e.target.value
                              )
                            }
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                          >
                            <option value="Applied">Applied</option>
                            <option value="In Review">In Review</option>
                            <option value="Interview">Interview</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setSelectedApplicant(application.applicant);
                              setShowContactModal(true);
                            }}
                            className="px-6 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold text-center"
                          >
                            Contact Applicant
                          </button>

                          <button
                            onClick={() => {
                              setSelectedApplicant(application.applicant);
                              setShowProfileModal(true);
                            }}
                            className="px-6 py-2 border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Contact Modal */}
          {showContactModal && selectedApplicant && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4"
              style={{ zIndex: 10000 }}
              onClick={() => setShowContactModal(false)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {selectedApplicant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {selectedApplicant.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedApplicant.title}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </div>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedApplicant.email}
                      </div>
                    </div>
                    <a
                      href={`mailto:${selectedApplicant.email}?subject=Regarding your application for ${job.title}`}
                      className="px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm font-semibold"
                    >
                      Send Email
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Phone
                      </div>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedApplicant.phone}
                      </div>
                    </div>
                    <a
                      href={`tel:${selectedApplicant.phone}`}
                      className="px-4 py-2 border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-semibold"
                    >
                      Call Now
                    </a>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal - Render outside main container */}
      {showProfileModal && selectedApplicant && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 dark:bg-black dark:bg-opacity-85 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8 overflow-y-auto max-h-[85vh]">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg mx-auto mb-4">
                  {selectedApplicant.profileImage ? (
                    <img
                      src={selectedApplicant.profileImage}
                      alt={selectedApplicant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 flex items-center justify-center ${
                      selectedApplicant.profileImage ? "hidden" : ""
                    }`}
                  >
                    <span className="text-white font-bold text-3xl">
                      {selectedApplicant.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedApplicant.name}
                </h3>
                <p className="text-xl text-primary-600 dark:text-primary-400 mb-2">
                  {selectedApplicant.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedApplicant.location || "Location not provided"}
                </p>
              </div>

              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    About
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedApplicant.bio}
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Experience
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedApplicant.experience}
                  </p>
                </div>

                {/* Resume */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Resume
                  </h4>
                  {selectedApplicant.resume ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-red-500 mr-3">
                            <svg
                              className="w-8 h-8"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {selectedApplicant.name.replace(/\s+/g, "_")}
                              _Resume.pdf
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Click to view or download resume
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            try {
                              const base64Data = selectedApplicant.resume;

                              // Check if it's a valid base64 data URL
                              if (
                                !base64Data ||
                                !base64Data.startsWith(
                                  "data:application/pdf;base64,"
                                )
                              ) {
                                alert(
                                  "Resume file is not available or in an invalid format."
                                );
                                return;
                              }

                              // Extract the base64 string (remove data URL prefix)
                              const base64String = base64Data.split(",")[1];

                              // Convert base64 to bytes
                              const binaryString = atob(base64String);
                              const bytes = new Uint8Array(binaryString.length);
                              for (let i = 0; i < binaryString.length; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                              }

                              // Create blob and open in new tab
                              const blob = new Blob([bytes], {
                                type: "application/pdf",
                              });
                              const blobUrl = URL.createObjectURL(blob);

                              // Open in new tab
                              const newTab = window.open(blobUrl, "_blank");
                              if (newTab) {
                                newTab.focus();
                                // Clean up the blob URL after a delay
                                setTimeout(
                                  () => URL.revokeObjectURL(blobUrl),
                                  10000
                                );
                              } else {
                                // Fallback: trigger download if popup blocked
                                const downloadLink =
                                  document.createElement("a");
                                downloadLink.href = blobUrl;
                                downloadLink.download = `${selectedApplicant.name.replace(
                                  /\s+/g,
                                  "_"
                                )}_Resume.pdf`;
                                downloadLink.click();
                                URL.revokeObjectURL(blobUrl);
                              }
                            } catch (error) {
                              console.error("Error opening resume:", error);
                              alert(
                                "Sorry, there was an error opening the resume. The file may be corrupted or in an unsupported format."
                              );
                            }
                          }}
                          className="px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold text-sm"
                        >
                          View Resume
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-gray-400 dark:text-gray-500 mr-3">
                            <svg
                              className="w-8 h-8"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-500 dark:text-gray-400">
                              No resume uploaded
                            </div>
                            <div className="text-sm text-gray-400 dark:text-gray-500">
                              Candidate has not provided a resume yet
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                          <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                            💡 To test resume viewing:
                          </div>
                          <div className="text-blue-700 dark:text-blue-400">
                            The test user "Alex Brown" has a sample PDF resume.
                            <br />
                            1. Apply for a job as Alex Brown
                            <br />
                            2. Login as employer to see the resume
                            <br />
                            3. Click "View Resume" to test the functionality
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Work Experience */}
                {selectedApplicant.workHistory &&
                  selectedApplicant.workHistory.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Work Experience
                      </h4>
                      <div className="space-y-4">
                        {selectedApplicant.workHistory.map((work, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-primary-200 pl-4 pb-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {work.position}
                                </h5>
                                <p className="text-primary-600 font-medium">
                                  {work.company}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {work.startDate} -{" "}
                                {work.current ? "Present" : work.endDate}
                              </span>
                            </div>
                            {work.description && (
                              <p className="text-gray-700 text-sm">
                                {work.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Education */}
                {selectedApplicant.education &&
                  selectedApplicant.education.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Education
                      </h4>
                      <div className="space-y-4">
                        {selectedApplicant.education.map((edu, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-green-200 pl-4 pb-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {edu.degree}
                                </h5>
                                <p className="text-green-600 font-medium">
                                  {edu.institution}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {edu.year}
                              </span>
                            </div>
                            {edu.description && (
                              <p className="text-gray-700 text-sm">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Portfolio */}
                {selectedApplicant.portfolio && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Portfolio
                    </h4>
                    <a
                      href={selectedApplicant.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center"
                    >
                      {selectedApplicant.portfolio}
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {selectedApplicant.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Phone:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {selectedApplicant.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <a
                  href={`mailto:${selectedApplicant.email}?subject=Regarding your application for ${job.title}`}
                  className="px-6 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
                >
                  Send Email
                </a>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobApplicants;
