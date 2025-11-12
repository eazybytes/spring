import httpClient from '../config/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Submit contact form data to the backend
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @param {Object} contactData - The contact form data
 * @param {string} contactData.name - Full name of the person
 * @param {string} contactData.email - Email address
 * @param {string} contactData.userType - Type of user (jobseeker, employer, other)
 * @param {string} contactData.subject - Subject of the contact message
 * @param {string} contactData.message - Detailed message
 * @returns {Promise<Object>} The created contact record
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.CONTACTS, contactData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);

    // Enhanced error handling with user-friendly messages
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;

      switch (status) {
        case 400:
          throw new Error(errorData.message || 'Invalid form data. Please check your inputs.');
        case 500:
          throw new Error('Server error. Please try again later.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(errorData.message || 'An error occurred while submitting your message.');
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};

/**
 * Fetch all contacts (admin functionality - future use)
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @returns {Promise<Array>} Array of contact records
 */
export const fetchAllContacts = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.CONTACTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

/**
 * Fetch open contact messages with sorting (admin functionality)
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @param {string} sortBy - Field to sort by (createdAt, name, email, subject, status)
 * @param {string} sortDir - Sort direction (asc or desc)
 * @returns {Promise<Array>} Array of open contact records sorted as specified
 */
export const fetchOpenContactMsgsWithSort = async (sortBy = 'createdAt', sortDir = 'asc') => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN_CONTACTS_SORT, {
      params: {
        sortBy,
        sortDir
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sorted contact messages:', error);
    throw error;
  }
};

/**
 * Fetch open contact messages with pagination and sorting (admin functionality)
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @param {number} pageNumber - Page number (0-indexed)
 * @param {number} pageSize - Number of items per page
 * @param {string} sortBy - Field to sort by (createdAt, name, email, subject, status)
 * @param {string} sortDir - Sort direction (asc or desc)
 * @returns {Promise<Object>} Page object containing content array and pagination metadata
 */
export const fetchOpenContactMsgsWithPaginationAndSort = async (
  pageNumber = 0,
  pageSize = 10,
  sortBy = 'createdAt',
  sortDir = 'asc'
) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN_CONTACTS_PAGE, {
      params: {
        pageNumber,
        pageSize,
        sortBy,
        sortDir
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated contact messages:', error);
    throw error;
  }
};

/**
 * Fetch a single contact by ID (admin functionality - future use)
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @param {number} id - Contact ID
 * @returns {Promise<Object>} Contact record
 */
export const fetchContactById = async (id) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.CONTACT_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
};

/**
 * Update contact status (admin functionality - future use)
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @param {number} id - Contact ID
 * @param {string} status - New status (NEW, IN_PROGRESS, RESOLVED, CLOSED)
 * @returns {Promise<Object>} Updated contact record
 */
export const updateContactStatus = async (id, status) => {
  try {
    const response = await httpClient.patch(API_ENDPOINTS.CONTACT_BY_ID(id), { status });
    return response.data;
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
};

/**
 * Delete a contact (admin functionality - future use)
 * Uses default API version (1.0) via httpClient interceptor
 *
 * @param {number} id - Contact ID
 * @returns {Promise<void>}
 */
export const deleteContact = async (id) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.CONTACT_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
