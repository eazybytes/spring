import { Link } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

const SavedJobs = () => {
  const { savedJobs, unsaveJob, applyForJob, isJobApplied } = useJobs();
  const { isJobSeeker, isAuthenticated, isLoading: authLoading } = useAuth();

  const formatSalary = (min, max) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
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

  const handleUnsave = async (jobId) => {
    await unsaveJob(jobId);
  };

  const handleQuickApply = (job) => {
    const result = applyForJob(job);
    if (result.success) {
      // Could add a toast notification here
    } else {
      console.error(result.error);
    }
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

  if (!isAuthenticated || !isJobSeeker) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 relative">
        <div className="text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {!isAuthenticated ? "Please Log In" : "Access Denied"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {!isAuthenticated
              ? "You need to be logged in to view your saved jobs."
              : "This page is only available for job seekers."}
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

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-primary-200/30 dark:from-purple-900/20 dark:to-primary-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent mb-2">
                Saved Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your bookmarked jobs for future reference
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {savedJobs.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Saved Jobs
              </div>
            </div>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-12 text-center">
            <div className="text-6xl mb-6">💾</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Saved Jobs Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Save jobs you're interested in to easily find them later. Click
              the heart icon on any job listing to save it.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Browse Jobs
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {savedJobs
              .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-6 mb-6">
                        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl w-16 h-16 flex items-center justify-center">
                          <img
                            src={job.companyLogo}
                            alt={`${job.company} logo`}
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 hidden w-12 h-12 items-center justify-center">
                            {(job.companyName || job.company || "C").charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              {job.title}
                            </Link>
                            <button
                              onClick={() => handleUnsave(job.id)}
                              className="text-red-500 hover:text-red-600 transition-colors p-2"
                              title="Remove from saved jobs"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 space-x-4 mb-4">
                            <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                              {job.companyName || job.company}
                            </span>
                            <span>•</span>
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
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                job.workType === "Remote"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : job.workType === "Hybrid"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {job.workType}
                            </span>
                            <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                              {job.category}
                            </span>
                            <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                              {job.experienceLevel}
                            </span>
                            {job.featured && (
                              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                                ⭐ Featured
                              </span>
                            )}
                            {job.urgent && (
                              <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                                🔥 Urgent
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Saved {getTimeAgo(job.savedAt)} • Posted{" "}
                            {getTimeAgo(job.postedDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:ml-8 text-center lg:text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {formatSalary(job.salary?.min, job.salary?.max)}
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                        <button
                          onClick={() => handleQuickApply(job)}
                          disabled={isJobApplied(job.id)}
                          className={`px-6 py-2 rounded-xl font-semibold transition-colors ${
                            isJobApplied(job.id)
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700"
                          }`}
                        >
                          {isJobApplied(job.id) ? "✓ Applied" : "Quick Apply"}
                        </button>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="px-6 py-2 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
