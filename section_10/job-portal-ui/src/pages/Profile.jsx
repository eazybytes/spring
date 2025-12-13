import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile as updateProfileApi,
  getProfilePictureUrl,
} from "../services/profileService";

const Profile = () => {
  const {
    user,
    updateProfile,
    updateProfileComplete,
    isJobSeeker,
    isLoading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    location: "",
    bio: "",
    experience: "",
    skills: [],
    portfolio: "",
    profileImage: null,
    resume: null,
    education: [],
    workHistory: [],
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    // Wait for auth to load before checking
    if (authLoading) return;

    if (!isJobSeeker) {
      navigate("/");
      return;
    }

    // Load profile data from backend every time user navigates to profile page
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();

        if (profileData && profileData.id) {
          // Load profile picture if available
          let profileImageUrl = null;
          if (profileData.profilePictureName) {
            profileImageUrl = await getProfilePictureUrl();
          }

          const loadedFormData = {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.mobileNumber || "",
            title: profileData.jobTitle || "",
            location: profileData.location || "",
            bio: profileData.professionalBio || "",
            experience: profileData.experienceLevel || "",
            skills: [],
            portfolio: profileData.portfolioWebsite || "",
            profileImage: profileImageUrl,
            resume: profileData.resumeName ? "Uploaded" : null,
            education: [],
            workHistory: [],
          };

          setFormData(loadedFormData);
        } else {
          // No profile yet, use user basic data
          const emptyFormData = {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.mobileNumber || "",
            title: "",
            location: "",
            bio: "",
            experience: "",
            skills: [],
            portfolio: "",
            profileImage: null,
            resume: null,
            education: [],
            workHistory: [],
          };

          setFormData(emptyFormData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Initialize with user data if profile load fails
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.mobileNumber || "",
            title: "",
            location: "",
            bio: "",
            experience: "",
            skills: [],
            portfolio: "",
            profileImage: null,
            resume: null,
            education: [],
            workHistory: [],
          });
        }
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user?.userId, isJobSeeker, navigate, authLoading]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (fieldName === "profileImage" && !file.type.startsWith("image/")) {
        showNotification("Please upload a valid image file", "error");
        return;
      }
      if (fieldName === "resume" && file.type !== "application/pdf") {
        showNotification("Please upload a PDF file for resume", "error");
        return;
      }

      // Store the actual file for upload
      if (fieldName === "profileImage") {
        setProfilePictureFile(file);
      } else if (fieldName === "resume") {
        setResumeFile(file);
      }

      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: "",
          institution: "",
          year: "",
          description: "",
        },
      ],
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addWorkHistory = () => {
    setFormData((prev) => ({
      ...prev,
      workHistory: [
        ...prev.workHistory,
        {
          id: Date.now(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          current: false,
        },
      ],
    }));
  };

  const updateWorkHistory = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workHistory: prev.workHistory.map((work) =>
        work.id === id ? { ...work, [field]: value } : work
      ),
    }));
  };

  const removeWorkHistory = (id) => {
    setFormData((prev) => ({
      ...prev,
      workHistory: prev.workHistory.filter((work) => work.id !== id),
    }));
  };

  const validateProfile = () => {
    const required = [
      "name",
      "email",
      "phone",
      "title",
      "location",
      "bio",
      "experience",
    ];
    const missing = required.filter((field) => !formData[field]);

    if (missing.length > 0) {
      showNotification(`Please fill in: ${missing.join(", ")}`, "error");
      return false;
    }

    if (!formData.resume) {
      showNotification("Please upload your resume", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    setIsLoading(true);

    try {
      // Prepare profile data for backend
      const profileData = {
        jobTitle: formData.title,
        location: formData.location,
        experienceLevel: formData.experience,
        professionalBio: formData.bio,
        portfolioWebsite: formData.portfolio || null,
      };

      // Call backend API
      const result = await updateProfileApi(
        profileData,
        profilePictureFile,
        resumeFile
      );

      if (result) {
        showNotification("Profile updated successfully!", "success");

        // Reload profile picture if it was uploaded
        let updatedProfileImage = formData.profileImage;
        if (profilePictureFile) {
          updatedProfileImage = await getProfilePictureUrl();
        }

        // Update form data with new profile picture
        const updatedFormData = {
          ...formData,
          profileImage: updatedProfileImage,
          resume: result.resumeName ? "Uploaded" : formData.resume,
        };

        setFormData(updatedFormData);

        // Check if profile is now complete and update auth context
        const completeness = calculateProfileCompleteness(updatedFormData);
        const isComplete = completeness === 100;

        if (updateProfileComplete) {
          updateProfileComplete(isComplete);
        }

        // Clear file states after successful upload
        setProfilePictureFile(null);
        setResumeFile(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(
        error.response?.data?.message ||
          "An error occurred while updating profile",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompleteness = (data) => {
    let score = 0;

    // Helper function to check if a field has a meaningful value
    const hasValue = (value) => {
      return value && value !== "" && value !== null && value !== undefined;
    };

    // Basic fields (10 points each) - Total 60 points
    if (hasValue(data.name)) score += 10;
    if (hasValue(data.email)) score += 10;
    if (hasValue(data.phone)) score += 10;
    if (hasValue(data.title)) score += 10;
    if (hasValue(data.location)) score += 10;
    if (hasValue(data.bio)) score += 10;

    // Experience (10 points)
    if (hasValue(data.experience)) score += 10;

    // Portfolio is optional - not counted

    // Profile image (10 points) - REQUIRED
    if (hasValue(data.profileImage)) score += 10;

    // Resume (20 points) - REQUIRED
    if (hasValue(data.resume)) score += 20;

    return Math.min(100, score);
  };

  const completeness = calculateProfileCompleteness(formData);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "👤" },
    { id: "files", label: "Files", icon: "📎" },
  ];

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

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-primary-200/30 dark:from-purple-900/20 dark:to-primary-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete your profile to start applying for jobs
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Completeness
              </span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {completeness}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            {completeness < 100 && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                Complete your profile to apply for jobs
              </p>
            )}
          </div>
        </div>

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

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50/50 dark:bg-primary-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-4xl">
                            {formData.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profileImage")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="e.g. Software Developer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="e.g. San Francisco, CA"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="Entry Level">
                        Entry Level (0-2 years)
                      </option>
                      <option value="Mid Level">Mid Level (2-5 years)</option>
                      <option value="Senior Level">
                        Senior Level (5-8 years)
                      </option>
                      <option value="Lead Level">Lead Level (8+ years)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio/Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === "files" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Resume *
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                    {formData.resume ? (
                      <div className="space-y-4">
                        <div className="text-green-600 dark:text-green-400">
                          <svg
                            className="w-12 h-12 mx-auto mb-2"
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
                          <p className="font-semibold">
                            Resume uploaded successfully!
                          </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const { getResumeUrl } = await import(
                                  "../services/profileService"
                                );
                                const resumeUrl = await getResumeUrl();
                                if (resumeUrl) {
                                  // Open resume in new tab
                                  window.open(resumeUrl, "_blank");
                                } else {
                                  showNotification("Resume not found", "error");
                                }
                              } catch (error) {
                                console.error("Error viewing resume:", error);
                                showNotification(
                                  "Failed to load resume",
                                  "error"
                                );
                              }
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Resume
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                          >
                            <label className="cursor-pointer">
                              Upload New Resume
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange(e, "resume")}
                                className="hidden"
                              />
                            </label>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Upload your resume (PDF only)
                        </p>
                        <button
                          type="button"
                          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                        >
                          <label className="cursor-pointer">
                            Choose Resume File
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileChange(e, "resume")}
                              className="hidden"
                            />
                          </label>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Profile Picture
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                    {formData.profileImage ? (
                      <div className="space-y-4">
                        <img
                          src={formData.profileImage}
                          alt="Profile preview"
                          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                        >
                          <label className="cursor-pointer">
                            Change Picture
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(e, "profileImage")
                              }
                              className="hidden"
                            />
                          </label>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400 dark:text-gray-500"
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
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Upload a professional profile picture
                        </p>
                        <button
                          type="button"
                          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
                        >
                          <label className="cursor-pointer">
                            Choose Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(e, "profileImage")
                              }
                              className="hidden"
                            />
                          </label>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isLoading
                    ? "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-700 hover:via-primary-800 hover:to-purple-800 text-white shadow-lg shadow-primary-500/25"
                }`}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
