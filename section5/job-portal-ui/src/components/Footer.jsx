import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-primary-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-tl from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 blur-lg opacity-20 rounded-lg"></div>
              <h3 className="relative text-4xl font-black bg-gradient-to-r from-primary-400 via-purple-400 to-primary-600 bg-clip-text text-transparent">
                JobPortal
              </h3>
            </div>
            <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
              Your trusted partner in finding the perfect career opportunity.
              Connect with top employers and build your professional future with
              confidence.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com/jobportal"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/jobportal"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/jobportal"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-800/50 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/jobportal"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-800/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent mb-6">
              For Job Seekers
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/jobs"
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/companies"
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Companies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              For Employers
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Browse Candidates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative border-t border-gray-700/50 mt-16 pt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent h-px top-0"></div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400 mb-6 md:mb-0">
              <a className="group relative hover:text-white transition-colors duration-300">
                <span className="relative z-10">Privacy Policy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -inset-2"></div>
              </a>
              <a className="group relative hover:text-white transition-colors duration-300">
                <span className="relative z-10">Terms of Service</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -inset-2"></div>
              </a>
              <a className="group relative hover:text-white transition-colors duration-300">
                <span className="relative z-10">Cookie Policy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -inset-2"></div>
              </a>
              <Link to="/contact" className="group relative hover:text-white transition-colors duration-300">
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -inset-2"></div>
              </Link>
            </div>
            <div className="text-center md:text-right">
              <div className="text-gray-400 text-sm mb-2">
                © 2025 JobPortal. All rights reserved.
              </div>
              <div className="text-xs text-gray-500">
                Made with ❤️ for job seekers worldwide
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
