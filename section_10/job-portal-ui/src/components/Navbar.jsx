import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, isEmployer, isJobSeeker, isAdmin } = useAuth();
  const { totalAppliedJobs, totalSavedJobs, totalPostedJobs } = useJobs();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-2xl shadow-primary-500/10 dark:shadow-primary-400/10 border-b border-gray-200/20 dark:border-gray-700/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 blur-lg opacity-20 rounded-lg"></div>
                  <h1 className="relative text-3xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent">
                    JobPortal
                  </h1>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-12 flex items-center space-x-1">
                <Link
                  to="/jobs"
                  className={`relative group px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive("/jobs")
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  <span className="relative z-10">Find Jobs</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl transition-all duration-300 transform group-hover:scale-105 ${
                      isActive("/jobs")
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                </Link>
                <Link
                  to="/companies"
                  className={`relative group px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive("/companies")
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  <span className="relative z-10">Companies</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl transition-all duration-300 transform group-hover:scale-105 ${
                      isActive("/companies")
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <button
                onClick={toggleTheme}
                className="relative group p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
                aria-label="Toggle theme"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative z-10">
                  {theme === "dark" ? (
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl hover:from-primary-100 hover:to-purple-100 dark:hover:from-primary-800/30 dark:hover:to-purple-800/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                      <div className="text-xs text-primary-600 dark:text-primary-400">
                        {isEmployer ? user.company : user.title}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-gray-300"
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

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                            isAdmin
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : isEmployer
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {isAdmin ? "Admin" : isEmployer ? "Employer" : "Job Seeker"}
                        </span>
                      </div>

                      {isJobSeeker && (
                        <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            My Profile
                          </Link>
                          <Link
                            to="/applied-jobs"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Applied Jobs
                            </span>
                            {totalAppliedJobs > 0 && (
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                                {totalAppliedJobs}
                              </span>
                            )}
                          </Link>
                          <Link
                            to="/saved-jobs"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              Saved Jobs
                            </span>
                            {totalSavedJobs > 0 && (
                              <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-0.5 rounded-full">
                                {totalSavedJobs}
                              </span>
                            )}
                          </Link>
                        </div>
                      )}

                      {isEmployer && (
                        <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                          <Link
                            to="/post-job"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Post New Job
                          </Link>
                          <Link
                            to="/employer/jobs"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                                />
                              </svg>
                              My Job Postings
                            </span>
                            {totalPostedJobs > 0 && (
                              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-0.5 rounded-full">
                                {totalPostedJobs}
                              </span>
                            )}
                          </Link>
                        </div>
                      )}

                      {isAdmin && (
                        <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                          <Link
                            to="/admin/companies"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            Company Management
                          </Link>
                          <Link
                            to="/admin/employers"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Employer Management
                          </Link>
                          <Link
                            to="/admin/contact-messages"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            Contact Messages
                          </Link>
                        </div>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="relative group px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-xl"
                  >
                    <span className="relative z-10">Log In</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </Link>
                  <Link
                    to="/register"
                    className="relative group overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-700 hover:via-primary-800 hover:to-purple-800 text-white px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg
                className="block h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/jobs"
                className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>

              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                      <div className="text-xs text-primary-600 dark:text-primary-400">
                        {isEmployer ? user.company : user.title}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      navigate("/", { replace: true });
                    }}
                    className="w-full text-left px-3 py-2 mt-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-base font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 px-3 py-2">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <div className="px-3 py-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
