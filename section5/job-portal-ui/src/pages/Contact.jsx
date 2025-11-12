import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitContactForm } from '../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'jobseeker',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();

  const userTypes = [
    { value: 'jobseeker', label: 'Job Seeker' },
    { value: 'employer', label: 'Employer' },
    { value: 'other', label: 'Other' },
  ];

  const subjectOptions = [
    'Technical Issue',
    'Account Problem',
    'Employer Onboarding',
    'Job Posting Issue',
    'Application Question',
    'Feature Request',
    'General Inquiry',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
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
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Submit contact form to backend API
      const response = await submitContactForm(formData);
      console.log('Contact form submitted successfully:', response);

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        userType: 'jobseeker',
        subject: '',
        message: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setIsSubmitting(false);
      setSubmitError(error.message || 'Failed to submit contact form. Please try again.');

      // Hide error message after 7 seconds
      setTimeout(() => {
        setSubmitError('');
      }, 7000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 relative transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 dark:from-primary-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent mb-2">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Have questions or need help? We're here to assist you!
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-green-800 dark:text-green-300 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Message sent successfully!</span>
            </div>
            <p className="text-sm">Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-800 dark:text-red-300 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-semibold">Submission failed!</span>
            </div>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                I am a *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.userType === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`font-semibold ${
                      formData.userType === type.value
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </span>
                    {formData.userType === type.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none text-gray-900 dark:text-white ${
                  errors.subject ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 outline-none resize-none text-gray-900 dark:text-white ${
                  errors.message ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Please describe your issue or inquiry in detail..."
              />
              {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum 10 characters. Current: {formData.message.length}
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-primary-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@jobportal.com</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Within 24-48 hours</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Call Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
