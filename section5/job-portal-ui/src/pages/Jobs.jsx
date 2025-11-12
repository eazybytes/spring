import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { jobTitles, cities, experienceLevels } from '../data/mockData'
import { useJobs } from '../context/JobContext'
import { useJobsData } from '../contexts/JobsDataContext'
import { useAuth } from '../context/AuthContext'
import RefreshButton from '../components/RefreshButton'
import ConfirmationModal from '../components/ConfirmationModal'

const Jobs = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [workTypeFilter, setWorkTypeFilter] = useState('')
  const [salaryMinFilter, setSalaryMinFilter] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 20
  const [notification, setNotification] = useState(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  
  const { applyForJob, saveJob, unsaveJob, isJobApplied, isJobSaved, withdrawApplication, getAllJobsSync } = useJobs()
  const { jobs: apiJobs, loading: jobsLoading, error: jobsError } = useJobsData()
  const { isAuthenticated, isJobSeeker, isEmployer, user } = useAuth()

  // Get all jobs including API jobs and user posted jobs
  const allJobs = useMemo(() => {
    return getAllJobsSync(apiJobs)
  }, [apiJobs, getAllJobsSync])

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search')
    const locationParam = searchParams.get('location')
    const companyParam = searchParams.get('company')
    
    if (searchParam) setSearchTerm(searchParam)
    if (locationParam) setLocationFilter(locationParam)
    if (companyParam) setSearchTerm(companyParam) // Search by company name
  }, [searchParams])

  const filteredJobs = useMemo(() => {
    let filtered = allJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchesCategory = !categoryFilter || job.category === categoryFilter
      const matchesExperience = !experienceFilter || job.experienceLevel === experienceFilter
      const matchesWorkType = !workTypeFilter || job.workType === workTypeFilter
      const matchesSalary = !salaryMinFilter || job.salary.min >= parseInt(salaryMinFilter)
      const matchesRemote = !remoteOnly || job.remote

      return matchesSearch && matchesLocation && matchesCategory && 
             matchesExperience && matchesWorkType && matchesSalary && matchesRemote
    })

    // Sort filtered jobs
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        break
      case 'salary-high':
        filtered.sort((a, b) => b.salary.max - a.salary.max)
        break
      case 'salary-low':
        filtered.sort((a, b) => a.salary.min - b.salary.min)
        break
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company))
        break
      default:
        break
    }

    return filtered
  }, [allJobs, searchTerm, locationFilter, categoryFilter, experienceFilter, workTypeFilter, salaryMinFilter, remoteOnly, sortBy])

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)

  const resetFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setCategoryFilter('')
    setExperienceFilter('')
    setWorkTypeFilter('')
    setSalaryMinFilter('')
    setRemoteOnly(false)
    setCurrentPage(1)
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleQuickApply = (job) => {
    if (!isAuthenticated || !isJobSeeker) return
    setSelectedJob(job)
    setShowApplyModal(true)
  }

  const confirmApply = async () => {
    if (!selectedJob) return

    const result = await applyForJob(selectedJob)
    if (result.success) {
      showNotification(result.message, 'success')
    } else {
      if (result.requiresProfile) {
        showNotification(result.error, 'error')
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
      } else {
        showNotification(result.error, 'error')
      }
    }
    setSelectedJob(null)
  }

  const handleWithdraw = (job) => {
    setSelectedJob(job)
    setShowWithdrawModal(true)
  }

  const confirmWithdraw = async () => {
    if (!selectedJob) return

    const result = await withdrawApplication(selectedJob.id)
    if (result.success) {
      showNotification(result.message, 'success')
    } else {
      showNotification(result.error, 'error')
    }
    setSelectedJob(null)
  }

  const handleSaveToggle = async (job) => {
    if (!isAuthenticated || !isJobSeeker) return

    const isSaved = isJobSaved(job.id)
    const result = isSaved ? await unsaveJob(job.id) : await saveJob(job)

    if (result.success) {
      showNotification(result.message, 'success')
    } else {
      showNotification(result.error, 'error')
    }
  }

  const formatSalary = (min, max) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  // Show loading state
  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (jobsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600 dark:text-gray-400">{jobsError}</p>
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
                Find Your Perfect Job
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Explore {allJobs.length} job opportunities from top companies worldwide
            </p>
            <div className="flex justify-center">
              <RefreshButton />
            </div>
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
                      placeholder="Job title, company, or keywords..."
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
                      placeholder="City, state, or country..."
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {Object.keys(jobTitles).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="">All Experience</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
                  value={workTypeFilter}
                  onChange={(e) => setWorkTypeFilter(e.target.value)}
                >
                  <option value="">All Work Types</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Salary ($)"
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400"
                  value={salaryMinFilter}
                  onChange={(e) => setSalaryMinFilter(e.target.value)}
                />
              </div>

              {/* Remote Toggle and Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                    />
                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${remoteOnly ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${remoteOnly ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Remote Only</span>
                  </label>
                  
                  <button
                    onClick={resetFilters}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
                  <select
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="company">Company A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredJobs.length} Jobs Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * jobsPerPage) + 1}-{Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} results
            </p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notification.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L12.732 4.5c-.77-.833-2.186-.833-2.954 0L2.857 16.5c-.77.833.192 2.5 1.732 2.5z" />
                )}
              </svg>
              {notification.message}
            </div>
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-6">
          {paginatedJobs.map((job, index) => (
            <div
              key={job.id}
              className="group bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="text-xl font-bold text-primary-600 dark:text-primary-400 hidden w-12 h-12 items-center justify-center">
                        {job.company.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/jobs/${job.id}`} className="block mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 space-x-4 mb-3">
                        <span className="font-semibold">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.jobType}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.workType === 'Remote' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : job.workType === 'Hybrid'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {job.workType}
                        </span>
                        <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold">
                          {job.category}
                        </span>
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                          {job.experienceLevel}
                        </span>
                        {job.featured && (
                          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                            ⭐ Featured
                          </span>
                        )}
                        {job.urgent && (
                          <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-1 rounded-full text-xs font-semibold">
                            🔥 Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:text-right lg:ml-8">
                  <div className="text-2xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {formatSalary(job.salary.min, job.salary.max)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {getTimeAgo(job.postedDate)} • {job.applicationsCount} applicants
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    {!isEmployer && (
                      <>
                        {isJobApplied(job.id) ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleWithdraw(job)
                            }}
                            className="px-4 py-2 rounded-xl font-semibold transition-colors text-sm border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Withdraw
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (!isAuthenticated) {
                                navigate('/login', { state: { from: { pathname: '/jobs' } } })
                                return
                              }
                              handleQuickApply(job)
                            }}
                            disabled={isAuthenticated && isJobSeeker && !user?.profileComplete}
                            className={`px-4 py-2 rounded-xl font-semibold transition-colors text-sm ${
                              (isAuthenticated && isJobSeeker && !user?.profileComplete)
                                ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700'
                            }`}
                          >
                            {!isAuthenticated
                              ? 'Login to Apply'
                              : !isJobSeeker
                              ? 'Job Seekers Only'
                              : !user?.profileComplete
                              ? 'Complete Profile'
                              : 'Quick Apply'
                            }
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (!isAuthenticated) {
                              navigate('/login', { state: { from: { pathname: '/jobs' } } })
                              return
                            }
                            handleSaveToggle(job)
                          }}
                          className={`px-4 py-2 rounded-xl font-semibold transition-colors text-sm border-2 ${
                            isJobSaved(job.id)
                              ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                              : (!isAuthenticated || !isJobSeeker)
                              ? 'border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                              : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400'
                          }`}
                        >
                          {isJobSaved(job.id) ? '❤️ Saved' : (!isAuthenticated ? '❤️ Login to Save' : !isJobSeeker ? '❤️ Job Seekers Only' : '❤️ Save')}
                        </button>
                      </>
                    )}
                    
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold text-center text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Apply Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onConfirm={confirmApply}
        title="Apply for this Job?"
        message={selectedJob ? `You are about to apply for the position of ${selectedJob.title} at ${selectedJob.company}. Make sure your profile is up to date before submitting your application.` : ''}
        confirmText="Yes, Apply"
        cancelText="Cancel"
        type="success"
      />

      {/* Withdraw Confirmation Modal */}
      <ConfirmationModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={confirmWithdraw}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw your application? This action cannot be undone."
        confirmText="Yes, Withdraw"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default Jobs