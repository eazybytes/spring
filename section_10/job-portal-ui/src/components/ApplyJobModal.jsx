import { useEffect, useState } from 'react';

const ApplyJobModal = ({
  isOpen,
  onClose,
  onConfirm,
  job,
  confirmText = 'Submit Application',
  cancelText = 'Cancel'
}) => {
  const [coverLetter, setCoverLetter] = useState('');

  // Reset cover letter when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCoverLetter('');
    }
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const handleSubmit = () => {
    onConfirm(coverLetter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <span className="text-3xl text-green-600 dark:text-green-400">
            ✓
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Apply for this Job?
        </h3>

        {/* Job Details */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {job.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {job.company} • {job.location}
            </p>
          </div>
        </div>

        {/* Cover Letter Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Cover Letter <span className="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write a brief cover letter to introduce yourself and explain why you're a great fit for this position..."
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
            rows="8"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {coverLetter.length} characters
          </p>
        </div>

        {/* Info Message */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Make sure your profile is up to date before submitting your application.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
