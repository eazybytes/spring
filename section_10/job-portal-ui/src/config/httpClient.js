import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "./api";

/**
 * Default API Accept Header
 * This value is used for the Accept header in all API requests
 * Follows the vendor-specific media type format: application/vnd.eazyapp+json;v=1.0
 * Developers can override this in individual requests if needed
 */
export const DEFAULT_ACCEPT_HEADER = "application/vnd.eazyapp+json;v=1.0";

/**
 * Create axios instance with default configuration
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for CSRF cookie handling
});

/**
 * Public endpoints that don't require authentication
 * These endpoints will not include the Authorization header
 */
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/companies/public",
  "/contacts/public",
];

/**
 * Check if the request URL is a public endpoint
 * Note: We need to check exact matches to avoid false positives
 * For example, /admin/contacts should not match /contacts
 */
const isPublicEndpoint = (url) => {
  return PUBLIC_ENDPOINTS.some((endpoint) => {
    // Check if URL exactly matches or starts with the endpoint followed by a slash or query param
    return (
      url === endpoint ||
      url.startsWith(endpoint + "/") ||
      url.startsWith(endpoint + "?")
    );
  });
};

/**
 * Request Interceptor
 * Automatically adds Accept header and handles CSRF token for non-safe HTTP methods
 */
httpClient.interceptors.request.use(
  async (config) => {
    // Add Accept header with default value
    // Developers can override this by passing headers in the request config

    config.headers.Accept = DEFAULT_ACCEPT_HEADER;

    // Add authentication token for non-public endpoints
    if (!isPublicEndpoint(config.url)) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Handle CSRF token for non-safe HTTP methods
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (!safeMethods.includes(config.method.toUpperCase())) {
      let csrfToken = Cookies.get("XSRF-TOKEN");

      // If CSRF token is not present in cookies, fetch it from the server
      if (!csrfToken) {
        try {
          await axios.get(`${API_BASE_URL}/csrf-token`, {
            withCredentials: true,
          });
          csrfToken = Cookies.get("XSRF-TOKEN");

          if (!csrfToken) {
            throw new Error("Failed to retrieve CSRF token from cookies");
          }
        } catch (error) {
          // Ignore 404 errors (endpoint might not be available) and continue
          if (error.response && error.response.status === 404) {
            console.warn(
              "[CSRF Token] Endpoint not found (404), continuing without CSRF token"
            );
          } else {
            console.error("[CSRF Token Error]", error);
            return Promise.reject(error);
          }
        }
      }

      // Add CSRF token to request header
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    // Log the request for debugging (can be removed in production)
    console.log(`[HTTP Request] ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("[HTTP Request Error]", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles response transformations and error handling
 */
httpClient.interceptors.response.use(
  (response) => {
    // Log the response for debugging (can be removed in production)
    console.log(
      `[HTTP Response] ${response.config.method.toUpperCase()} ${
        response.config.url
      }`,
      {
        status: response.status,
        data: response.data,
      }
    );

    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error("[HTTP Response Error]", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Only redirect to login if this is NOT a login request
          // and we're NOT already on the login page
          const isLoginRequest = error.config.url.includes("/auth/login");
          const isOnLoginPage = window.location.pathname === "/login";

          if (!isLoginRequest && !isOnLoginPage) {
            // Unauthorized - clear token and user data, then redirect to login
            localStorage.removeItem("authToken");
            localStorage.removeItem("jobPortalUser");
            window.location.href = "/login";
          } else {
            // If it's a login request or we're on login page, just clear token
            // but don't redirect (let the component handle the error)
            localStorage.removeItem("authToken");
            localStorage.removeItem("jobPortalUser");
          }
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error("An error occurred");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("[HTTP No Response]", error.request);
    } else {
      // Something else happened
      console.error("[HTTP Error]", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to make requests with custom API version
 *
 * @example
 * // Use default version (1.0)
 * const response = await httpClient.get('/companies');
 *
 * @example
 * // Use specific version (2.0)
 * const response = await httpClient.get('/companies', {
 *   headers: { 'Accept': 'application/vnd.eazyapp+json;v=2.0' }
 * });
 *
 * @example
 * // Use withApiVersion helper
 * const response = await withApiVersion('2.0').get('/companies');
 */
export const withApiVersion = (version) => {
  const acceptHeader = `application/vnd.eazyapp+json;v=${version}`;
  return {
    get: (url, config = {}) =>
      httpClient.get(url, {
        ...config,
        headers: { ...config.headers, Accept: acceptHeader },
      }),
    post: (url, data, config = {}) =>
      httpClient.post(url, data, {
        ...config,
        headers: { ...config.headers, Accept: acceptHeader },
      }),
    put: (url, data, config = {}) =>
      httpClient.put(url, data, {
        ...config,
        headers: { ...config.headers, Accept: acceptHeader },
      }),
    patch: (url, data, config = {}) =>
      httpClient.patch(url, data, {
        ...config,
        headers: { ...config.headers, Accept: acceptHeader },
      }),
    delete: (url, config = {}) =>
      httpClient.delete(url, {
        ...config,
        headers: { ...config.headers, Accept: acceptHeader },
      }),
  };
};

export default httpClient;
