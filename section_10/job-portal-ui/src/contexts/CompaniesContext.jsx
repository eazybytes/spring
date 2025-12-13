import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { fetchCompanies } from "../services/companyService";

const CompaniesContext = createContext();

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useCompanies = () => {
  const context = useContext(CompaniesContext);
  if (!context) {
    throw new Error("useCompanies must be used within a CompaniesProvider");
  }
  return context;
};

export const CompaniesProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const isFetchingRef = useRef(false);

  const loadCompanies = useCallback(
    async (force = false) => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        return;
      }

      // Check cache validity
      const now = Date.now();
      const cacheValid = lastFetchTime && now - lastFetchTime < CACHE_DURATION;

      if (!force && cacheValid) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        const data = await fetchCompanies();
        setCompanies(data);
        setLastFetchTime(Date.now());
        setError(null);
      } catch (err) {
        console.error("Error loading companies:", err);
        setError("Failed to load companies. Please try again later.");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [lastFetchTime]
  );

  // Initial load
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Auto-refresh every 5 minutes if user is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadCompanies();
      }
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [loadCompanies]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      loadCompanies();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadCompanies]);

  const getCompanyByName = (name) => {
    return (
      companies.find(
        (c) =>
          c.name.toLowerCase().replace(/[^a-z0-9]/g, "") ===
          name.toLowerCase().replace(/[^a-z0-9]/g, "")
      ) || null
    );
  };

  const getCompanyById = (id) => {
    return companies.find((c) => c.id === id) || null;
  };

  const forceRefresh = async () => {
    await loadCompanies(true);
  };

  const getCacheAge = () => {
    if (!lastFetchTime) return null;
    return Math.floor((Date.now() - lastFetchTime) / 1000); // Age in seconds
  };

  const isCacheStale = () => {
    if (!lastFetchTime) return true;
    return Date.now() - lastFetchTime >= CACHE_DURATION;
  };

  const value = {
    companies,
    loading,
    error,
    getCompanyByName,
    getCompanyById,
    refetch: loadCompanies,
    forceRefresh,
    getCacheAge,
    isCacheStale,
    lastFetchTime,
  };

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  );
};
