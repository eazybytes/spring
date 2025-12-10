import { useState } from 'react';
import { useJobsData } from '../contexts/JobsDataContext';
import { useCompanies } from '../contexts/CompaniesContext';

const RefreshButton = ({ showLabel = true, className = '' }) => {
  const { forceRefresh: refreshJobs, getCacheAge: getJobsCacheAge, loading: jobsLoading } = useJobsData();
  const { forceRefresh: refreshCompanies, getCacheAge: getCompaniesCacheAge, loading: companiesLoading } = useCompanies();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshJobs(), refreshCompanies()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for visual feedback
    }
  };

  const formatCacheAge = () => {
    const jobsAge = getJobsCacheAge();
    const companiesAge = getCompaniesCacheAge();

    if (!jobsAge && !companiesAge) return 'Never updated';

    const maxAge = Math.max(jobsAge || 0, companiesAge || 0);

    if (maxAge < 60) return `${maxAge}s ago`;
    if (maxAge < 3600) return `${Math.floor(maxAge / 60)}m ago`;
    return `${Math.floor(maxAge / 3600)}h ago`;
  };

  const isLoading = jobsLoading || companiesLoading || isRefreshing;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium transition-all duration-200
          ${isLoading
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg active:scale-95'
          }
        `}
        title={`Last updated: ${formatCacheAge()}`}
      >
        <svg
          className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {showLabel && (
          <span className="hidden sm:inline">
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </span>
        )}
      </button>

      {showLabel && !isLoading && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Updated {formatCacheAge()}
        </span>
      )}
    </div>
  );
};

export default RefreshButton;
