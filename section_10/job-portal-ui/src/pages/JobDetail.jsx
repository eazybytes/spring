import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import { useJobsData } from "../contexts/JobsDataContext";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "../components/ConfirmationModal";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const {
    applyForJob,
    saveJob,
    unsaveJob,
    isJobApplied,
    isJobSaved,
    withdrawApplication,
    getJobByIdSync,
  } = useJobs();
  const { jobs: apiJobs, getJobById } = useJobsData();
  const { user, isAuthenticated, isJobSeeker, isEmployer } = useAuth();

  useEffect(() => {
    // First check if job data was passed via navigation state (from employer jobs page)
    if (location.state?.job) {
      // Job is already transformed via transformJob function
      setJob(location.state.job);
      return;
    }

    // Otherwise, try to get from API jobs
    let foundJob = getJobById(id);

    // If not found in API jobs, check user posted jobs
    if (!foundJob) {
      foundJob = getJobByIdSync(id, apiJobs);
    }

    if (foundJob) {
      setJob(foundJob);
    }
  }, [id, location.state, getJobById, getJobByIdSync, apiJobs]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (!isJobSeeker) {
      showNotification("Only job seekers can apply for jobs", "error");
      return;
    }

    setShowApplyModal(true);
  };

  const confirmApply = async () => {
    const result = await applyForJob(job);
    if (result.success) {
      showNotification(result.message, "success");
    } else {
      if (result.requiresProfile) {
        showNotification(result.error, "error");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        showNotification(result.error, "error");
      }
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (!isJobSeeker) {
      showNotification("Only job seekers can save jobs", "error");
      return;
    }

    const isSaved = isJobSaved(job.id);
    const result = isSaved ? await unsaveJob(job.id) : await saveJob(job);

    if (result.success) {
      showNotification(result.message, "success");
    } else {
      showNotification(result.error, "error");
    }
  };

  const handleWithdraw = () => {
    if (!isAuthenticated || !isJobSeeker) return;
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async () => {
    const result = await withdrawApplication(job.id);
    if (result.success) {
      showNotification(result.message, "success");
    } else {
      showNotification(result.error, "error");
    }
  };

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

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The job you're looking for doesn't exist.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                to="/jobs"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Jobs
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-400">
                {job.title}
              </span>
            </div>
          </nav>

          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
            {/* Notification */}
            {notification && (
              <div
                className={`mb-6 p-4 rounded-xl border ${
                  notification.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                    : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
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
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-3xl w-24 h-24 flex items-center justify-center">
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 hidden w-16 h-16 items-center justify-center">
                      {job.company.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 space-x-4 mb-4">
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
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
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          job.workType === "Remote"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : job.workType === "Hybrid"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {job.workType}
                      </span>
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-semibold">
                        {job.category}
                      </span>
                      <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
                        {job.experienceLevel}
                      </span>
                      {job.featured && (
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
                          ⭐ Featured
                        </span>
                      )}
                      {job.urgent && (
                        <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
                          🔥 Urgent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:ml-8 text-center lg:text-right">
                <div className="text-3xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {formatSalary(job.salary.min, job.salary.max)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Posted {getTimeAgo(job.postedDate)} • {job.applicationsCount}{" "}
                  applicants
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  {!isEmployer && (
                    <>
                      {job && isJobApplied(job.id) ? (
                        <button
                          onClick={handleWithdraw}
                          className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25"
                        >
                          Withdraw Application
                        </button>
                      ) : (
                        <button
                          onClick={handleApply}
                          disabled={
                            isAuthenticated &&
                            isJobSeeker &&
                            !user?.profileComplete
                          }
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            isAuthenticated &&
                            isJobSeeker &&
                            !user?.profileComplete
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed shadow-gray-500/25"
                              : "bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-700 hover:via-primary-800 hover:to-purple-800 text-white shadow-primary-500/25"
                          }`}
                        >
                          {!isAuthenticated
                            ? "Login to Apply"
                            : !isJobSeeker
                            ? "Job Seekers Only"
                            : !user?.profileComplete
                            ? "Complete Profile"
                            : "Apply Now"}
                        </button>
                      )}

                      <button
                        onClick={handleSave}
                        className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                          job && isJobSaved(job.id)
                            ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                            : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400"
                        }`}
                      >
                        {job && isJobSaved(job.id)
                          ? "❤️ Saved"
                          : isAuthenticated
                          ? "❤️ Save Job"
                          : "❤️ Login to Save"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Job Description
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  className={`text-gray-700 dark:text-gray-300 leading-relaxed ${
                    !showFullDescription ? "line-clamp-6" : ""
                  }`}
                >
                  {job.description}
                </div>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold mt-4 inline-flex items-center"
                >
                  {showFullDescription ? "Show Less" : "Read More"}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      showFullDescription ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Requirements
              </h2>
              <div className="space-y-4">
                {job.requirements.map((req, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Job Overview */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Job Overview
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Job Type
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {job.jobType}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Experience Level
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {job.experienceLevel}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Work Type
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {job.workType}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Category
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {job.category}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Remote Available
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {job.remote ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                About {job.company}
              </h3>
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <img
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400 hidden">
                    {job.company.charAt(0)}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {job.company}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Leading technology company focused on innovation and growth.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Industry
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {job.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Company Size
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    1001-5000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Founded
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    2010
                  </span>
                </div>
              </div>
              <Link
                to={`/companies/${job.company
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="w-full mt-6 px-6 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center block"
              >
                View Company Profile
              </Link>
            </div>

            {/* Share */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share this job
              </h3>
              <div className="flex space-x-3">
                <button className="flex-1 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  LinkedIn
                </button>
                <button className="flex-1 p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors">
                  Twitter
                </button>
                <button className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onConfirm={confirmApply}
        title="Apply for this Job?"
        message={`You are about to apply for the position of ${job?.title} at ${job?.company}. Make sure your profile is up to date before submitting your application.`}
        confirmText="Yes, Apply"
        cancelText="Cancel"
        type="success"
      />

      {/* Withdraw Confirmation Modal */}
      <ConfirmationModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={confirmWithdraw}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw your application? This action cannot be undone."
        confirmText="Yes, Withdraw"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default JobDetail;
