import httpClient from "../config/httpClient";
import { API_ENDPOINTS } from "../config/api";

/**
 * Get the current user's profile
 */
export const getProfile = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.PROFILE);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

/**
 * Create or update user profile
 * @param {Object} profileData - Profile data (jobTitle, location, etc.)
 * @param {File|null} profilePicture - Profile picture file
 * @param {File|null} resume - Resume file
 */
export const updateProfile = async (profileData, profilePicture, resume) => {
  try {
    const formData = new FormData();

    // Add profile data as JSON string
    formData.append("profile", JSON.stringify(profileData));

    // Add files if provided
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    if (resume) {
      formData.append("resume", resume);
    }

    const response = await httpClient.put(
      API_ENDPOINTS.UPDATE_PROFILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Get profile picture URL
 * Returns a blob URL that can be used in img src
 */
export const getProfilePictureUrl = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.PROFILE_PICTURE, {
      responseType: "blob",
    });

    // Create a blob URL from the response
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
};

/**
 * Download resume
 */
export const downloadResume = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.PROFILE_RESUME, {
      responseType: "blob",
    });

    // Create a blob URL and trigger download
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading resume:", error);
    throw error;
  }
};

/**
 * Get resume as blob URL for preview
 */
export const getResumeUrl = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.PROFILE_RESUME, {
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
};
