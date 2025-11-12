import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCompanies } from '../contexts/CompaniesContext'
import { useJobsData } from '../contexts/JobsDataContext'

const Companies = () => {
  const { companies, loading, error, refetch } = useCompanies()
  const { jobs } = useJobsData()
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [sizeFilter, setSizeFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const companiesPerPage = 12

  // Get unique industries, sizes, and locations for filters
  const industries = [...new Set(companies.map(company => company.industry))].sort()
  const sizes = [...new Set(companies.map(company => company.size))].sort()
  const locations = [...new Set(companies.flatMap(company => company.locations))].sort()

  // Enhanced companies with job counts
  const enhancedCompanies = useMemo(() => {
    return companies.map(company => {
      const jobCount = jobs.filter(job => job.company === company.name).length
      return { ...company, jobCount }
    })
  }, [companies, jobs])

  const filteredCompanies = useMemo(() => {
    let filtered = enhancedCompanies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIndustry = !industryFilter || company.industry === industryFilter
      const matchesSize = !sizeFilter || company.size === sizeFilter
      const matchesLocation = !locationFilter || company.locations.some(loc => 
        loc.toLowerCase().includes(locationFilter.toLowerCase())
      )
      const matchesRating = !ratingFilter || company.rating >= parseFloat(ratingFilter)

      return matchesSearch && matchesIndustry && matchesSize && matchesLocation && matchesRating
    })

    // Sort filtered companies
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'jobs':
        filtered.sort((a, b) => b.jobCount - a.jobCount)
        break
      case 'founded':
        filtered.sort((a, b) => b.founded - a.founded)
        break
      default:
        break
    }

    return filtered
  }, [enhancedCompanies, searchTerm, industryFilter, sizeFilter, locationFilter, ratingFilter, sortBy])

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage)
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * companiesPerPage, currentPage * companiesPerPage)

  const resetFilters = () => {
    setSearchTerm('')
    setIndustryFilter('')
    setSizeFilter('')
    setLocationFilter('')
    setRatingFilter('')
    setCurrentPage(1)
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>)
    }

    return stars
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading companies...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Companies</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                Top Companies
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover {companies.length} amazing companies actively hiring top talent
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              {/* Main Search */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-4 top-4 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Company name or industry..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-4 top-4 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Location..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <select
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>

                <select
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="jobs">Sort by Jobs</option>
                  <option value="founded">Sort by Founded</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={resetFilters}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Clear All Filters
                </button>
                
                <div className="text-gray-600 dark:text-gray-400">
                  {filteredCompanies.length} companies found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {filteredCompanies.length} Companies Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * companiesPerPage) + 1}-{Math.min(currentPage * companiesPerPage, filteredCompanies.length)} of {filteredCompanies.length} results
          </p>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCompanies.map((company, index) => (
            <Link
              key={company.name}
              to={`/companies/${company.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
              className="group block bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 transform hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400 hidden">
                    {company.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {company.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{company.industry}</p>
                
                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center mr-2">
                    {renderStars(company.rating)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {company.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Company Size</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{company.size}</span>
                </div>

                {company.employees && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Employees</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {company.employees.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Open Jobs</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {company.jobCount} positions
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Founded</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{company.founded}</span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Locations</div>
                  <div className="flex flex-wrap gap-1">
                    {company.locations.slice(0, 3).map((location, idx) => (
                      <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs">
                        {location}
                      </span>
                    ))}
                    {company.locations.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{company.locations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">View Company</span>
                  <svg className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i
              if (pageNum > totalPages) return null
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Companies