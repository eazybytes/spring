import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCompanies } from '../contexts/CompaniesContext'
import { useJobsData } from '../contexts/JobsDataContext'

const CompanyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, getCompanyByName } = useCompanies()
  const { jobs } = useJobsData()
  const [company, setCompany] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentJobPage, setCurrentJobPage] = useState(1)
  const jobsPerPage = 6

  useEffect(() => {
    if (!loading) {
      const foundCompany = getCompanyByName(id)
      setCompany(foundCompany)
    }
  }, [id, loading, getCompanyByName])

  const companyJobs = useMemo(() => {
    if (!company) return []
    return jobs.filter(job => job.company === company.name)
  }, [company, jobs])

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentJobPage - 1) * jobsPerPage
    return companyJobs.slice(startIndex, startIndex + jobsPerPage)
  }, [companyJobs, currentJobPage])

  const totalJobPages = Math.ceil(companyJobs.length / jobsPerPage)

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
      stars.push(<span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">☆</span>)
    }

    return stars
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading company details...</p>
        </div>
      </div>
    )
  }

  // Company not found (after loading is complete)
  if (!loading && !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Company Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The company you're looking for doesn't exist.
          </p>
          <Link
            to="/companies"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/companies" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Companies
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-400">{company.name}</span>
            </div>
          </nav>

          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-3xl w-32 h-32 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 hidden w-20 h-20 items-center justify-center">
                      {company.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                      {company.name}
                    </h1>
                    <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-4">
                      {company.industry}
                    </p>
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(company.rating)}
                        </div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {company.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Founded {company.founded}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {company.size} Company
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                        {companyJobs.length} Open Positions
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                        {company.locations.length} Locations
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:ml-8 text-center lg:text-right">
                <div className="space-y-4">
                  <Link
                    to={`/jobs?company=${encodeURIComponent(company.name)}`}
                    className="block px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-700 hover:via-primary-800 hover:to-purple-800 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-500/25"
                  >
                    View All Jobs
                  </Link>

                  <button className="block w-full px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                    Follow Company
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-2">
            <nav className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: '🏢' },
                { id: 'jobs', label: `Jobs (${companyJobs.length})`, icon: '💼' },
                { id: 'culture', label: 'Culture', icon: '🌟' },
                { id: 'benefits', label: 'Benefits', icon: '🎁' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About {company.name}</h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {company.description || `${company.name} is a leading ${company.industry.toLowerCase()} company that has been innovating since ${company.founded}.
                      With a strong presence across ${company.locations.length} global locations, we're committed to delivering exceptional
                      value to our customers and creating meaningful opportunities for our employees.`}
                    </p>
                    {!company.description && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4">
                        As a {company.size.toLowerCase()} organization, we foster a culture of innovation, collaboration, and growth.
                        Our team is passionate about pushing boundaries and creating solutions that make a real difference in people's lives.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To empower businesses and individuals through innovative technology solutions that drive growth, 
                    efficiency, and success in an ever-evolving digital landscape.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Innovation', desc: 'We embrace new ideas and creative solutions' },
                      { title: 'Excellence', desc: 'We strive for the highest quality in everything we do' },
                      { title: 'Collaboration', desc: 'We work together to achieve common goals' },
                      { title: 'Integrity', desc: 'We act with honesty and transparency' }
                    ].map(value => (
                      <div key={value.title} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{value.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Open Positions ({companyJobs.length})
                    </h2>
                    <Link 
                      to={`/jobs?company=${encodeURIComponent(company.name)}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                    >
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {paginatedJobs.map(job => (
                      <Link
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        className="block p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4 mb-3">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                              </span>
                              <span>•</span>
                              <span>{job.jobType}</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                job.workType === 'Remote' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : job.workType === 'Hybrid'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {job.workType}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                                {formatSalary(job.salary.min, job.salary.max)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Posted {getTimeAgo(job.postedDate)}
                              </span>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Job Pagination */}
                  {totalJobPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                      <button
                        onClick={() => setCurrentJobPage(Math.max(1, currentJobPage - 1))}
                        disabled={currentJobPage === 1}
                        className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {Array.from({ length: totalJobPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentJobPage(pageNum)}
                          className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                            currentJobPage === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentJobPage(Math.min(totalJobPages, currentJobPage + 1))}
                        disabled={currentJobPage === totalJobPages}
                        className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'culture' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company Culture</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Work-Life Balance', icon: '⚖️', desc: 'We believe in maintaining a healthy balance between work and personal life.' },
                      { title: 'Learning & Growth', icon: '📚', desc: 'Continuous learning opportunities and professional development programs.' },
                      { title: 'Diversity & Inclusion', icon: '🌍', desc: 'We celebrate diversity and foster an inclusive environment for all.' },
                      { title: 'Innovation Culture', icon: '💡', desc: 'Encouraging creative thinking and innovative solutions.' }
                    ].map(item => (
                      <div key={item.title} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl">
                        <div className="text-3xl mb-4">{item.icon}</div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Benefits & Perks</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      '💰 Competitive salary and equity',
                      '🏥 Comprehensive health insurance',
                      '🦷 Dental and vision coverage',
                      '🏖️ Unlimited PTO policy',
                      '💻 Latest tech equipment',
                      '🎓 Learning & development budget',
                      '🍕 Free meals and snacks',
                      '🏋️ Gym membership reimbursement',
                      '🚌 Commuter benefits',
                      '👶 Parental leave policy',
                      '💡 Innovation time (20% projects)',
                      '🌟 Stock option programs'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Company Stats */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Company Stats</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Founded</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{company.founded}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Company Size</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{company.size}</div>
                </div>
                {company.employees && (
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Employees</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{company.employees.toLocaleString()}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Open Positions</div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{companyJobs.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Employee Rating</div>
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(company.rating)}</div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{company.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Locations</h3>
              <div className="space-y-3">
                {company.locations.map((location, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h3>
              <div className="space-y-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-center"
                  >
                    Visit Website
                  </a>
                )}
                <button className="w-full p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-semibold">
                  Follow on LinkedIn
                </button>
                <button className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-semibold">
                  Contact HR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetail