import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJobsData } from '../contexts/JobsDataContext'

const JobsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeFilter, setActiveFilter] = useState('Recent')
  const [displayCount, setDisplayCount] = useState(6)
  const navigate = useNavigate()
  const { jobs, loading } = useJobsData()

  const categories = ['All', 'Technology', 'Design', 'Marketing', 'Sales', 'Finance', 'Healthcare']
  const filters = ['Recent', 'Popular', 'Salary', 'Remote']

  // Filter and sort jobs based on selected filters
  const filteredJobs = useMemo(() => {
    let filtered = jobs

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(job => job.category === activeCategory)
    }

    // Sort by filter
    switch (activeFilter) {
      case 'Recent':
        filtered = [...filtered].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        break
      case 'Popular':
        filtered = [...filtered].sort((a, b) => b.applicationsCount - a.applicationsCount)
        break
      case 'Salary':
        filtered = [...filtered].sort((a, b) => b.salary.max - a.salary.max)
        break
      case 'Remote':
        filtered = filtered.filter(job => job.remote)
        break
      default:
        break
    }

    return filtered
  }, [jobs, activeCategory, activeFilter])

  const displayedJobs = filteredJobs.slice(0, displayCount)
  
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

  const loadMoreJobs = () => {
    setDisplayCount(prev => Math.min(prev + 6, filteredJobs.length))
  }

  // Show loading skeleton
  if (loading) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Loading Jobs...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl p-6 h-80"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50">
            💼 Premium Job Opportunities
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
              Featured Jobs
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover your next career opportunity from our curated list of premium job postings from top companies worldwide
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative group px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 text-white shadow-2xl shadow-primary-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
              }`}
            >
              <span className="relative z-10">{category}</span>
              {activeCategory !== category && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {displayedJobs.length} of {filteredJobs.length} jobs
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayedJobs.map((job, index) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="group relative bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 cursor-pointer transform hover:scale-105 hover:-translate-y-2 block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-purple-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="mr-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold">{job.company}</p>
                    </div>
                  </div>
                  {job.workType === 'Remote' && (
                    <span className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700">
                      🌍 Remote
                    </span>
                  )}
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4 space-x-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                </div>

                <div className="text-2xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  {formatSalary(job.salary.min, job.salary.max)}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills && job.skills.slice(0, 3).map((skill, tagIndex) => (
                    <span
                      key={skill}
                      className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold px-4 py-2 rounded-xl border border-primary-200/50 dark:border-primary-700/50 hover:scale-105 transition-transform duration-200"
                      style={{ animationDelay: `${(index + tagIndex) * 50}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{getTimeAgo(job.postedDate)}</span>
                  <div className="relative group overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-500/25">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Apply Now</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {displayCount < filteredJobs.length && (
          <div className="text-center mt-16">
            <button
              onClick={loadMoreJobs}
              className="relative group px-12 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 hover:text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Load More Jobs ({filteredJobs.length - displayCount} remaining)
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default JobsSection