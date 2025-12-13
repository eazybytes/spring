import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import httpClient from "../../config/httpClient";
import { API_ENDPOINTS } from "../../config/api";

const ContactMessages = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [messageToClose, setMessageToClose] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("asc");

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, [sortBy, sortDir, pageNumber, pageSize]);

  const fetchMessages = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("jobPortalUser");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token) {
        console.error("No auth token found - user needs to login");
        setError("You are not authenticated. Please login again.");
        setMessages([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const response = await httpClient.get(API_ENDPOINTS.ADMIN_CONTACTS_PAGE, {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          sortBy: sortBy,
          sortDir: sortDir,
        },
      });

      // Check if we got HTML instead of JSON (authentication failed)
      if (
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>")
      ) {
        console.error(
          "Received HTML login page instead of JSON - authentication failed"
        );
        setError("Authentication failed. Please login again.");
        setMessages([]);
        // Clear invalid token
        localStorage.removeItem("authToken");
        localStorage.removeItem("jobPortalUser");
        return;
      }

      // The backend returns a Page object with pagination info
      const pageData = response.data;
      const contactsData = Array.isArray(pageData.content)
        ? pageData.content
        : [];

      setMessages(contactsData);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
      setError("");
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      console.error("Error details:", err.response || err.message);
      setError("Failed to fetch contact messages. Please try again.");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (messageId) => {
    // Toggle expanded state - if clicking the same row, collapse it
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const handleCloseMessage = (messageId, event) => {
    // Stop event propagation to prevent row expansion
    if (event) {
      event.stopPropagation();
    }

    // Show confirmation modal
    setMessageToClose(messageId);
    setShowConfirmModal(true);
  };

  const confirmCloseMessage = async () => {
    if (!messageToClose) return;

    try {
      await httpClient.patch(
        API_ENDPOINTS.UPDATE_CONTACT_STATUS(messageToClose)
      );

      // Refresh the entire table by fetching fresh data from the server
      await fetchMessages();

      // Collapse the expanded row if it was the one that was closed
      if (expandedMessageId === messageToClose) {
        setExpandedMessageId(null);
      }

      // Show success notification
      setSuccessMessage("Message has been successfully closed.");
      setError("");

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      // Close modal
      setShowConfirmModal(false);
      setMessageToClose(null);
    } catch (err) {
      console.error("Error closing message:", err);
      setError("Failed to close message. Please try again.");
      setSuccessMessage("");

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);

      // Close modal
      setShowConfirmModal(false);
      setMessageToClose(null);
    }
  };

  const cancelCloseMessage = () => {
    setShowConfirmModal(false);
    setMessageToClose(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all contact form submissions
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-green-800 dark:text-green-300">
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6"
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
              <span className="font-semibold">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-800 dark:text-red-300">
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6"
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
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Sorting and Pagination Controls */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="subject">Subject</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Direction:
              </label>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Per Page:
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNumber(0); // Reset to first page when changing page size
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{messages.length}</span>{" "}
              of <span className="font-semibold">{totalElements}</span> messages
            </div>
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {messages.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No contact messages found
                      </td>
                    </tr>
                  ) : (
                    messages.map((message) => (
                      <>
                        <tr
                          key={message.id}
                          onClick={() => handleRowClick(message.id)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {message.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {message.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {message.userType || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {message.subject}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                            <div className="line-clamp-2">
                              {message.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                message.status === "OPEN"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                              }`}
                            >
                              {message.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(message.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {message.status === "OPEN" && (
                              <button
                                onClick={(e) =>
                                  handleCloseMessage(message.id, e)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                Close
                              </button>
                            )}
                          </td>
                        </tr>
                        {expandedMessageId === message.id && (
                          <tr
                            key={`${message.id}-details`}
                            className="bg-gray-50 dark:bg-gray-700/50"
                          >
                            <td colSpan="8" className="px-6 py-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Name
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                      {message.name}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Email
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                      {message.email}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      User Type
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        {message.userType || "N/A"}
                                      </span>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Status
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                      <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          message.status === "OPEN"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                                        }`}
                                      >
                                        {message.status}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Date Submitted
                                  </label>
                                  <p className="text-gray-900 dark:text-white">
                                    {formatDate(message.createdAt)}
                                  </p>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Subject
                                  </label>
                                  <p className="text-gray-900 dark:text-white">
                                    {message.subject}
                                  </p>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                  </label>
                                  <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                      {message.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 0 && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page Info */}
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page <span className="font-semibold">{pageNumber + 1}</span>{" "}
                    of <span className="font-semibold">{totalPages}</span>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* First Page Button */}
                    <button
                      onClick={() => setPageNumber(0)}
                      disabled={pageNumber === 0}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        pageNumber === 0
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      }`}
                    >
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
                          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Previous Page Button */}
                    <button
                      onClick={() => setPageNumber(pageNumber - 1)}
                      disabled={pageNumber === 0}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        pageNumber === 0
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      }`}
                    >
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    {(() => {
                      const pages = [];
                      const maxPagesToShow = 5;
                      let startPage = Math.max(
                        0,
                        pageNumber - Math.floor(maxPagesToShow / 2)
                      );
                      let endPage = Math.min(
                        totalPages - 1,
                        startPage + maxPagesToShow - 1
                      );

                      if (endPage - startPage < maxPagesToShow - 1) {
                        startPage = Math.max(0, endPage - maxPagesToShow + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setPageNumber(i)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              pageNumber === i
                                ? "bg-primary-600 text-white shadow-md"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      }
                      return pages;
                    })()}

                    {/* Next Page Button */}
                    <button
                      onClick={() => setPageNumber(pageNumber + 1)}
                      disabled={pageNumber >= totalPages - 1}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        pageNumber >= totalPages - 1
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      }`}
                    >
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* Last Page Button */}
                    <button
                      onClick={() => setPageNumber(totalPages - 1)}
                      disabled={pageNumber >= totalPages - 1}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        pageNumber >= totalPages - 1
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      }`}
                    >
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
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
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
                  Confirm Close Message
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Please confirm that this message has been handled by the
                  operations team.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                  Are you sure you want to close this message?
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelCloseMessage}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCloseMessage}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Yes, Close Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
