import { Link } from 'react-router-dom'
import { useCompanies } from '../contexts/CompaniesContext'
import { useJobsData } from '../contexts/JobsDataContext'

const CompaniesSection = () => {
  const { companies, loading } = useCompanies()
  const { jobs } = useJobsData()

  // Get job counts for each company
  const companiesWithJobCounts = companies.slice(0, 8).map(company => ({
    ...company,
    jobCount: jobs.filter(job => job.company === company.name).length
  }))
  
  // Add gradient colors based on industry
  const getGradient = (industry) => {
    switch (industry) {
      case 'Technology': return 'from-blue-500 to-purple-500'
      case 'E-commerce': return 'from-orange-500 to-yellow-500'
      case 'Automotive': return 'from-red-600 to-red-800'
      case 'Entertainment': return 'from-red-600 to-pink-600'
      case 'Music': return 'from-green-500 to-green-600'
      case 'Travel': return 'from-pink-500 to-rose-500'
      case 'Fintech': return 'from-purple-500 to-indigo-500'
      case 'Cryptocurrency': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-primary-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-purple-950/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50">
            🏢 Industry Leaders
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
              Top Companies Hiring
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join the world's most innovative companies and accelerate your career growth with these industry leaders
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading companies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companiesWithJobCounts.map((company, index) => (
            <Link
              key={company.name}
              to={`/companies/${company.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
              className="group relative bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 transform hover:scale-105 hover:-translate-y-2 block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glassmorphism effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(company.industry)} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
              
              <div className="relative z-10">
                <div className={`mb-6 p-4 bg-gradient-to-br ${getGradient(company.industry)} rounded-2xl inline-block transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 w-20 h-20 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 hidden w-full h-full items-center justify-center">
                      {company.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {company.name}
                </h3>

                {company.employees && (
                  <div className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    {company.employees.toLocaleString()} employees
                  </div>
                )}

                <div className="text-gray-600 dark:text-gray-400 mb-4 font-semibold">
                  <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{company.jobCount}</span>
                  <div className="text-sm">open positions</div>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 transition-all duration-300 ${
                          i < Math.floor(company.rating) 
                            ? 'fill-current transform group-hover:scale-110' 
                            : 'fill-gray-300 dark:fill-gray-600'
                        }`}
                        viewBox="0 0 24 24"
                        style={{ animationDelay: `${(index + i) * 50}ms` }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {company.rating}
                  </span>
                </div>
                
                <span className={`inline-block text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r ${getGradient(company.industry)} text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                  {company.industry}
                </span>
              </div>
            </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link 
            to="/companies"
            className="relative group overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 hover:from-primary-700 hover:via-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-primary-500/25 inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              View All Companies ({companies.length})
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CompaniesSection