import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "jobSeeker",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const { login, isLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // Check if there's a success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state after showing it
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(
      formData.email,
      formData.password,
      formData.userType
    );

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fillDemoCredentials = (type) => {
    if (type === "employer") {
      setFormData({
        email: "sanjana@gmail.com",
        password: "EazyBytes@1803",
        userType: "employer",
      });
    } else if (type === "admin") {
      setFormData({
        email: "admin@gmail.com",
        password: "EazyBytes@1803",
        userType: "admin",
      });
    } else {
      setFormData({
        email: "john@gmail.com",
        password: "EazyBytes@1803",
        userType: "jobSeeker",
      });
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-5rem)] ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-primary-50"
      } flex items-center justify-center px-4 py-12 relative`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800/80 border-gray-700/30"
              : "bg-white/80 border-white/20"
          } backdrop-blur-lg shadow-2xl rounded-3xl p-8 border`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent">
                Welcome Back
              </h1>
            </div>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } text-lg`}
            >
              Sign in to your JobPortal account
            </p>
          </div>

          {/* Demo Credentials Toggle */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className={`w-full p-3 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 text-blue-300 hover:from-blue-800/30 hover:to-purple-800/30"
                  : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100"
              } rounded-xl transition-all duration-300 text-sm font-medium`}
            >
              {showDemoCredentials ? "Hide" : "Show"} Demo Credentials
            </button>

            {showDemoCredentials && (
              <div
                className={`mt-4 p-4 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-gray-800 to-blue-900/30 border border-gray-700"
                    : "bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200"
                } rounded-xl`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } mb-3 font-medium`}
                >
                  Try these demo accounts:
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("employer")}
                    className={`w-full p-2 text-left ${
                      theme === "dark"
                        ? "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    } rounded-lg transition-colors text-sm`}
                  >
                    <div className="font-medium text-purple-700">Employer</div>
                    <div className="text-gray-500">
                      sanjana@gmail.com / EazyBytes@1803
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("jobSeeker")}
                    className={`w-full p-2 text-left ${
                      theme === "dark"
                        ? "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    } rounded-lg transition-colors text-sm`}
                  >
                    <div className="font-medium text-blue-700">Job Seeker</div>
                    <div className="text-gray-500">
                      john@gmail.com / EazyBytes@1803
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("admin")}
                    className={`w-full p-2 text-left ${
                      theme === "dark"
                        ? "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    } rounded-lg transition-colors text-sm`}
                  >
                    <div className="font-medium text-blue-700">Admin</div>
                    <div className="text-gray-500">
                      admin@gmail.com / EazyBytes@1803
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                className={`block text-sm font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className={`block text-sm font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${
                  theme === "dark"
                    ? "bg-green-900/30 border border-green-700 text-green-300"
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${
                  theme === "dark"
                    ? "bg-red-900/30 border border-red-700 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-primary-700 hover:to-purple-700 focus:ring-4 focus:ring-primary-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <div className="text-center">
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
