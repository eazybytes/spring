import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllJobs } from '../services/companyService';

const JobsDataContext = createContext();

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useJobsData = () => {
  const context = useContext(JobsDataContext);
  if (!context) {
    throw new Error('useJobsData must be used within a JobsDataProvider');
  }
  return context;
};

export const JobsDataProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const isFetchingRef = useRef(false);

  const loadJobs = useCallback(async (force = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log('[JobsDataContext] Fetch already in progress, skipping...');
      return;
    }

    // Check cache validity
    const now = Date.now();
    const cacheValid = lastFetchTime && (now - lastFetchTime) < CACHE_DURATION;

    if (!force && cacheValid) {
      console.log('[JobsDataContext] Using cached data, cache is still valid');
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      console.log('[JobsDataContext] Starting to fetch jobs...');
      const data = await fetchAllJobs();
      console.log('[JobsDataContext] Fetched jobs:', data.length, 'jobs');
      console.log('[JobsDataContext] Sample job:', data[0]);
      setJobs(data);
      setLastFetchTime(Date.now());
      setError(null);
    } catch (err) {
      console.error('[JobsDataContext] Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [lastFetchTime]);

  // Initial load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Auto-refresh every 5 minutes if user is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        console.log('[JobsDataContext] Auto-refreshing data...');
        loadJobs();
      }
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [loadJobs]);

  // Refresh on window focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      console.log('[JobsDataContext] Window focused, checking cache...');
      loadJobs();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadJobs]);

  const getJobById = (id) => {
    return jobs.find(job => job.id === parseInt(id)) || null;
  };

  const getJobsByCompany = (companyId) => {
    return jobs.filter(job => job.companyId === companyId);
  };

  const getJobsByCategory = (category) => {
    return jobs.filter(job => job.category === category);
  };

  const forceRefresh = async () => {
    console.log('[JobsDataContext] Force refresh requested');
    await loadJobs(true);
  };

  const updateJobApplicationsCount = (jobId, increment = true) => {
    console.log(`[JobsDataContext] ${increment ? 'Incrementing' : 'Decrementing'} applications count for job ${jobId}`);
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === parseInt(jobId)
          ? {
              ...job,
              applicationsCount: increment
                ? (job.applicationsCount || 0) + 1
                : Math.max((job.applicationsCount || 0) - 1, 0)
            }
          : job
      )
    );
  };

  const getCacheAge = () => {
    if (!lastFetchTime) return null;
    return Math.floor((Date.now() - lastFetchTime) / 1000); // Age in seconds
  };

  const isCacheStale = () => {
    if (!lastFetchTime) return true;
    return (Date.now() - lastFetchTime) >= CACHE_DURATION;
  };

  const value = {
    jobs,
    loading,
    error,
    getJobById,
    getJobsByCompany,
    getJobsByCategory,
    refetch: loadJobs,
    forceRefresh,
    updateJobApplicationsCount,
    getCacheAge,
    isCacheStale,
    lastFetchTime,
    totalJobs: jobs.length
  };

  return (
    <JobsDataContext.Provider value={value}>
      {children}
    </JobsDataContext.Provider>
  );
};
