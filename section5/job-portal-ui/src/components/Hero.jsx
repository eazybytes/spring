import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [jobSearch, setJobSearch] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (jobSearch) searchParams.set("search", jobSearch);
    if (location) searchParams.set("location", location);

    navigate(`/jobs?${searchParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-300 to-blue-400 rounded-full opacity-5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50">
                🚀 Join 50,000+ professionals finding their dream jobs
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              Find Your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  Dream Job
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 blur-2xl opacity-20 animate-pulse"></div>
              </span>
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                Today
              </span>
            </h1>

            <p className="text-xl  text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Discover thousands of job opportunities with all the information
              you need.
              <br className="hidden md:block" />
              Find your next career opportunity and apply with confidence.
            </p>

            <div className="max-w-5xl mx-auto mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center">
                          <svg
                            className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Job title, keywords, or company"
                          className="w-full pl-14 pr-6 py-5 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg font-medium transition-all duration-300 hover:shadow-lg"
                          value={jobSearch}
                          onChange={(e) => setJobSearch(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center">
                          <svg
                            className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors"
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
                        </div>
                        <input
                          type="text"
                          placeholder="City, state, or country"
                          className="w-full pl-14 pr-6 py-5 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg font-medium transition-all duration-300 hover:shadow-lg"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSearch}
                      className="relative group overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 hover:from-primary-700 hover:via-purple-700 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-primary-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Search Jobs
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white/50 to-primary-50/50 dark:from-gray-800/50 dark:to-primary-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                  Jobs Available
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Updated daily
                </div>
              </div>
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-800/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                  Active Companies
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Top employers
                </div>
              </div>
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent mb-2">
                  5K+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                  Success Stories
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Happy professionals
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
