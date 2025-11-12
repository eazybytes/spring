import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCompanies } from '../../contexts/CompaniesContext';
import httpClient from '../../config/httpClient';
import { API_ENDPOINTS } from '../../config/api';

const EmployerManagement = () => {
  const { theme } = useTheme();
  const { companies: contextCompanies, loading: companiesLoading } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for user search and elevation
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Use companies from context
  const companies = contextCompanies;

  const handleAssignCompany = async () => {
    setError('');
    setSuccess('');

    if (!searchedUser || !selectedCompanyId) {
      setError('Please select a company');
      return;
    }

    try {
      setIsAssigning(true);
      const response = await httpClient.put(API_ENDPOINTS.ASSIGN_COMPANY_TO_EMPLOYER(searchedUser.userId), {
        companyId: parseInt(selectedCompanyId)
      });
      setSuccess(`Successfully assigned company to ${searchedUser.name}`);
      setSearchedUser(response.data);
    } catch (err) {
      console.error('Error assigning company:', err);
      setError(err.response?.data?.message || 'Failed to assign company');
    } finally {
      setIsAssigning(false);
    }
  };

  // New functions for user search and elevation
  const handleSearchUser = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchedUser(null);
    setError('');
    setSuccess('');
    setSelectedCompanyId('');

    if (!searchEmail.trim()) {
      setSearchError('Please enter an email address');
      return;
    }

    try {
      setIsSearching(true);
      const response = await httpClient.get(API_ENDPOINTS.SEARCH_USER_BY_EMAIL, {
        params: { email: searchEmail }
      });
      setSearchedUser(response.data);
      // Pre-populate company dropdown if user already has a company assigned
      if (response.data.companyId) {
        setSelectedCompanyId(response.data.companyId.toString());
      }
      setSearchError('');
    } catch (err) {
      console.error('Error searching user:', err);
      if (err.response?.status === 404) {
        setSearchError('User not found with this email address');
      } else {
        setSearchError(err.response?.data?.message || 'Failed to search user');
      }
      setSearchedUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleElevateToEmployer = async (userId) => {
    setError('');
    setSuccess('');

    try {
      const response = await httpClient.put(API_ENDPOINTS.ELEVATE_TO_EMPLOYER(userId));
      setSuccess(`Successfully elevated ${response.data.name} to ROLE_EMPLOYER`);
      setSearchedUser(response.data);
    } catch (err) {
      console.error('Error elevating user:', err);
      setError(err.response?.data?.message || 'Failed to elevate user to employer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Search users, elevate to employer role, and assign companies
          </p>
        </div>

        {/* User Search and Elevation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Search and Elevate User
          </h2>

          <form onSubmit={handleSearchUser} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter user email address"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search User'}
              </button>
            </div>
          </form>

          {/* Search Error */}
          {searchError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {searchError}
            </div>
          )}

          {/* Searched User Result */}
          {searchedUser && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Found
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {searchedUser.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {searchedUser.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {searchedUser.mobileNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Role</p>
                  <p className="text-base font-medium">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      searchedUser.role === 'ROLE_EMPLOYER'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : searchedUser.role === 'ROLE_ADMIN'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {searchedUser.role}
                    </span>
                  </p>
                </div>
                {searchedUser.companyName && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Company</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {searchedUser.companyName}
                    </p>
                  </div>
                )}
                {searchedUser.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {new Date(searchedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {searchedUser.role === 'ROLE_JOB_SEEKER' && (
                  <button
                    onClick={() => handleElevateToEmployer(searchedUser.userId)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                  >
                    Elevate to Employer
                  </button>
                )}

                {searchedUser.role === 'ROLE_EMPLOYER' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {searchedUser.companyId ? 'Reassign Company' : 'Assign Company'}
                      </label>
                      <div className="flex gap-3">
                        <select
                          value={selectedCompanyId}
                          onChange={(e) => setSelectedCompanyId(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                          disabled={isAssigning || companiesLoading}
                        >
                          <option value="">-- Select a company --</option>
                          {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleAssignCompany}
                          disabled={!selectedCompanyId || isAssigning}
                          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAssigning ? 'Assigning...' : 'Assign'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {searchedUser.role === 'ROLE_ADMIN' && (
                  <div className="text-yellow-600 dark:text-yellow-400 font-medium">
                    Admin users cannot be elevated or assigned to companies
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerManagement;
