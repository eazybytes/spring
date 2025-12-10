import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobsData } from '../contexts/JobsDataContext';
import httpClient from '../config/httpClient';
import { API_ENDPOINTS } from '../config/api';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    workType: 'On-site',
    category: 'Technology',
    experienceLevel: 'Mid-level',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    applicationDeadline: '',
    requirements: [''],
    benefits: [''],
    remote: false,
    featured: false,
    urgent: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isEmployer, isAuthenticated, isLoading: authLoading } = useAuth();
  const { forceRefresh } = useJobsData();
  const navigate = useNavigate();

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const workTypes = ['Remote', 'Hybrid', 'On-site'];
  const categories = ['Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'Operations', 'Other'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'];
  const salaryPeriods = ['year', 'month', 'hour'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.salaryMin || formData.salaryMin < 1000) {
      newErrors.salaryMin = 'Minimum salary must be at least $1,000';
    }

    if (!formData.salaryMax || formData.salaryMax < 1000) {
      newErrors.salaryMax = 'Maximum salary must be at least $1,000';
    }

    if (parseInt(formData.salaryMax) <= parseInt(formData.salaryMin)) {
      newErrors.salaryMax = 'Maximum salary must be higher than minimum salary';
    }

    const validRequirements = formData.requirements.filter(req => req.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    }

    const validBenefits = formData.benefits.filter(benefit => benefit.trim());
    if (validBenefits.length === 0) {
      newErrors.benefits = 'At least one benefit is needed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty requirements and benefits and convert to JSON string
      const requirementsList = formData.requirements.filter(req => req.trim());
      const benefitsList = formData.benefits.filter(benefit => benefit.trim());

      // Prepare job data for backend
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        workType: formData.workType,
        category: formData.category,
        experienceLevel: formData.experienceLevel,
        salaryMin: parseFloat(formData.salaryMin),
        salaryMax: parseFloat(formData.salaryMax),
        salaryCurrency: formData.salaryCurrency,
        salaryPeriod: formData.salaryPeriod,
        requirements: requirementsList.length > 0 ? JSON.stringify(requirementsList) : null,
        benefits: benefitsList.length > 0 ? JSON.stringify(benefitsList) : null,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        remote: formData.workType === 'Remote' || formData.remote,
        featured: formData.featured,
        urgent: formData.urgent,
        status: 'ACTIVE'
      };

      await httpClient.post(API_ENDPOINTS.POST_JOB, jobData);

      // Force refresh the jobs cache so the new job appears immediately
      await forceRefresh();

      navigate('/employer/jobs', {
        state: { message: 'Job posted successfully!', type: 'success' }
      });
    } catch (error) {
      console.error('Error posting job:', error);
      setErrors({
        general: error.response?.data?.message || 'Failed to post job. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!isAuthenticated || !isEmployer) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 relative">
        <div className="text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{!isAuthenticated ? 'Please Log In' : 'Access Denied'}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{!isAuthenticated ? 'You need to be logged in to post jobs.' : 'This page is only available for employers.'}</p>
          <a href="/" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect candidate for your {user.company}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., San Francisco, CA"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                >
                  {workTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary *
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none ${
                    errors.salaryMin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                />
                {errors.salaryMin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salaryMin}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary *
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none ${
                    errors.salaryMax ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="80000"
                />
                {errors.salaryMax && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salaryMax}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Period
                </label>
                <select
                  name="salaryPeriod"
                  value={formData.salaryPeriod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                >
                  {salaryPeriods.map(period => (
                    <option key={period} value={period}>{period.charAt(0).toUpperCase() + period.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Application Deadline (Optional)
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
              />
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Additional Options
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Featured Job
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="urgent"
                    checked={formData.urgent}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Urgent Hiring
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="remote"
                    checked={formData.remote}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Remote Friendly
                  </span>
                </label>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Requirements *
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                    placeholder="e.g., 3+ years of React experience"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requirements')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                + Add Requirement
              </button>
              {errors.requirements && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.requirements}</p>}
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Benefits & Perks *
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'benefits')}
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none"
                    placeholder="e.g., Health insurance, Flexible hours"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'benefits')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                + Add Benefit
              </button>
              {errors.benefits && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.benefits}</p>}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Posting Job...</span>
                  </div>
                ) : (
                  'Post Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;