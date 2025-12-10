import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Hero from '../components/Hero'
import JobsSection from '../components/JobsSection'
import CompaniesSection from '../components/CompaniesSection'

const Home = () => {
  const { user, isJobSeeker } = useAuth()

  return (
    <>
      <Hero />
      
      {/* Profile Completion Banner for Job Seekers */}
      {isJobSeeker && !user?.profileComplete && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-orange-400">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L12.732 4.5c-.77-.833-2.186-.833-2.954 0L2.857 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Complete Your Profile to Start Applying
                  </h3>
                  <p className="text-orange-600">
                    Add your resume, skills, and experience to unlock job applications and get discovered by employers.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/profile"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <JobsSection />
      <CompaniesSection />
    </>
  )
}

export default Home