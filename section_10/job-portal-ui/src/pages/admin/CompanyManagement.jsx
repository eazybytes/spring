import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import httpClient from "../../config/httpClient";
import { API_ENDPOINTS } from "../../config/api";

const CompanyManagement = () => {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    industry: "",
    size: "",
    rating: "",
    locations: "",
    founded: "",
    description: "",
    employees: "",
    website: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Fetch companies from admin API
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.get(API_ENDPOINTS.COMPANIES_ADMIN);
      setCompanies(response.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(err.response?.data?.message || "Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e, companyId = null) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsSaving(true);
      // Prepare data for backend
      const dataToSend = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        founded: formData.founded ? parseInt(formData.founded) : null,
        employees: formData.employees ? parseInt(formData.employees) : null,
        ...(companyId && { id: companyId }), // Include id if updating
      };

      if (companyId) {
        // Update existing company
        await httpClient.put(
          API_ENDPOINTS.UPDATE_COMPANY_BY_ID(companyId),
          dataToSend
        );
        setSuccess("Company updated successfully");
      } else {
        // Create new company
        await httpClient.post(API_ENDPOINTS.COMPANIES_CREATE_ADMIN, dataToSend);
        setSuccess("Company created successfully");
      }

      // Reset form
      resetForm();
      setEditingCompanyId(null);
      setIsAddingNew(false);

      // Refresh companies data from backend to get latest
      await fetchCompanies();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving company:", err);
      setError(err.response?.data?.message || "Failed to save company");
      // Hide error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (company) => {
    setEditingCompanyId(company.id);
    setIsAddingNew(false);
    setFormData({
      name: company.name || "",
      logo: company.logo || "",
      industry: company.industry || "",
      size: company.size || "",
      rating: company.rating || "",
      locations: company.locations || "",
      founded: company.founded || "",
      description: company.description || "",
      employees: company.employees || "",
      website: company.website || "",
    });
    setError("");
    setSuccess("");
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingCompanyId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingCompanyId(null);
    setIsAddingNew(false);
    resetForm();
    setError("");
  };

  const handleDeleteClick = (company) => {
    setDeleteConfirmation(company);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await httpClient.delete(
        API_ENDPOINTS.DELETE_COMPANY_BY_ID(deleteConfirmation.id)
      );
      setSuccess("Company deleted successfully");
      setDeleteConfirmation(null);

      // Refresh companies data from backend to get latest
      await fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
      setError(err.response?.data?.message || "Failed to delete company");
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      industry: "",
      size: "",
      rating: "",
      locations: "",
      founded: "",
      description: "",
      employees: "",
      website: "",
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Company Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage companies in the system
            </p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={isAddingNew || editingCompanyId !== null}
            className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            + Add New Company
          </button>
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

        {/* Companies Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Founded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Add New Company Row */}
                  {isAddingNew && (
                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                      <td colSpan="7" className="px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Add New Company
                        </h3>
                        <form
                          onSubmit={(e) => handleSubmit(e, null)}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Company Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Enter company name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Industry *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.industry}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    industry: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g. Technology"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Size *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.size}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    size: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g. Medium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Rating *
                              </label>
                              <input
                                type="number"
                                required
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    rating: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="0-5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Founded *
                              </label>
                              <input
                                type="number"
                                required
                                min="1800"
                                max={new Date().getFullYear()}
                                value={formData.founded}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    founded: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Year"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Employees *
                              </label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={formData.employees}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    employees: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Number"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Logo Path *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.logo}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    logo: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="/logos/company.png"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Locations *
                              </label>
                              <input
                                type="text"
                                value={formData.locations}
                                required
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    locations: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g. New York, London"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Website *
                              </label>
                              <input
                                type="url"
                                required
                                value={formData.website}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    website: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="https://example.com"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Description *
                            </label>
                            <textarea
                              rows={2}
                              required
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Company description"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm disabled:opacity-50"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancel}
                              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:border-gray-400 transition-all duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}

                  {companies.length === 0 && !isAddingNew ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No companies found. Click "Add New Company" to create
                        one.
                      </td>
                    </tr>
                  ) : (
                    companies.map((company) => (
                      <>
                        {/* View Mode Row (always show) */}
                        <tr
                          key={company.id}
                          className={
                            editingCompanyId === company.id
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }
                        >
                          {/* Company (Logo + Name) */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {company.logo ? (
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-10 h-10 object-contain rounded mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded flex items-center justify-center mr-3">
                                  <svg
                                    className="w-6 h-6 text-gray-400 dark:text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {company.name}
                              </div>
                            </div>
                          </td>

                          {/* Industry */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {company.industry || "N/A"}
                          </td>

                          {/* Size */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {company.size || "N/A"}
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {company.rating ? (
                              <div className="flex items-center">
                                <svg
                                  className="w-4 h-4 text-yellow-400 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>
                                  {parseFloat(company.rating).toFixed(1)}
                                </span>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>

                          {/* Founded */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {company.founded || "N/A"}
                          </td>

                          {/* Employees */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {company.employees
                              ? company.employees.toLocaleString()
                              : "N/A"}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(company)}
                                disabled={
                                  editingCompanyId !== null || isAddingNew
                                }
                                className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 shadow-sm shadow-primary-500/25 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(company)}
                                disabled={
                                  editingCompanyId !== null || isAddingNew
                                }
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 shadow-sm shadow-red-500/25 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Edit Mode Form (show below summary row if editing) */}
                        {editingCompanyId === company.id && (
                          <tr className="bg-blue-50 dark:bg-blue-900/20">
                            <td colSpan="7" className="px-6 py-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Edit Company
                              </h3>
                              <form
                                onSubmit={(e) => handleSubmit(e, company.id)}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Company Name *
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={formData.name}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          name: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="Enter company name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Industry
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.industry}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          industry: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="e.g. Technology"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Size
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.size}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          size: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="e.g. Medium"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Rating
                                    </label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      max="5"
                                      value={formData.rating}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          rating: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="0-5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Founded
                                    </label>
                                    <input
                                      type="number"
                                      min="1800"
                                      max={new Date().getFullYear()}
                                      value={formData.founded}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          founded: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="Year"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Employees
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={formData.employees}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          employees: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="Number"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Logo Path
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.logo}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          logo: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="/logos/company.png"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Locations
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.locations}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          locations: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="e.g. New York, London"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      Website
                                    </label>
                                    <input
                                      type="url"
                                      value={formData.website}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          website: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="https://example.com"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        description: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Company description"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm disabled:opacity-50"
                                  >
                                    {isSaving ? "Saving..." : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:border-gray-400 transition-all duration-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Delete Company
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {deleteConfirmation.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-semibold hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
