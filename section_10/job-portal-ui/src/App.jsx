import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { CompaniesProvider } from "./contexts/CompaniesContext";
import { JobsDataProvider } from "./contexts/JobsDataContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppliedJobs from "./pages/AppliedJobs";
import SavedJobs from "./pages/SavedJobs";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import JobApplicants from "./pages/JobApplicants";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Dashboard from "./pages/admin/Dashboard";
import CompanyManagement from "./pages/admin/CompanyManagement";
import EmployerManagement from "./pages/admin/EmployerManagement";
import ContactMessages from "./pages/admin/ContactMessages";

function App() {
  return (
    <AuthProvider>
      <JobsDataProvider>
        <JobProvider>
          <CompaniesProvider>
            <ThemeProvider>
              <Router>
                <ScrollToTop />
                <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="jobs/:id" element={<JobDetail />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="companies/:id" element={<CompanyDetail />} />

                  {/* Job Seeker Routes */}
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="applied-jobs"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                        <AppliedJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="saved-jobs"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                        <SavedJobs />
                      </ProtectedRoute>
                    }
                  />

                  {/* Employer Routes */}
                  <Route
                    path="post-job"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <PostJob />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="employer/jobs"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <MyJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="job-applicants/:jobId"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <JobApplicants />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/companies"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <CompanyManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/employers"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <EmployerManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/contact-messages"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ContactMessages />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth Routes */}
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />

                  {/* Contact Route */}
                  <Route path="contact" element={<Contact />} />
                </Route>
              </Routes>
            </Router>
          </ThemeProvider>
          </CompaniesProvider>
        </JobProvider>
      </JobsDataProvider>
    </AuthProvider>
  );
}

export default App;
