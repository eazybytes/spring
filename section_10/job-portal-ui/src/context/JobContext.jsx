import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useJobsData } from '../contexts/JobsDataContext';
import * as savedJobService from '../services/savedJobService';
import * as jobApplicationService from '../services/jobApplicationService';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const { user } = useAuth();
  const { updateJobApplicationsCount } = useJobsData();

  // Load user-specific jobs data from localStorage and backend
  useEffect(() => {
    if (user) {
      // Load job seeker data
      if (user.role === 'ROLE_JOB_SEEKER') {
        // Load applied jobs from backend
        const loadAppliedJobs = async () => {
          try {
            const applicationsData = await jobApplicationService.getMyApplications();
            // Transform backend data to match frontend format
            const transformedApplications = applicationsData.map(app => ({
              ...app.job,
              appliedAt: app.appliedAt,
              status: app.status,
              applicationId: app.id,
              coverLetter: app.coverLetter
            }));
            setAppliedJobs(transformedApplications);
          } catch (error) {
            console.error('Error loading applied jobs from backend:', error);
            // Fallback to localStorage if backend fails
            const localAppliedJobs = localStorage.getItem(`appliedJobs_${user.userId}`);
            if (localAppliedJobs) {
              try {
                setAppliedJobs(JSON.parse(localAppliedJobs));
              } catch (err) {
                console.error('Error loading applied jobs from localStorage:', err);
              }
            }
          }
        };

        // Load saved jobs from backend
        const loadSavedJobs = async () => {
          try {
            const savedJobsData = await savedJobService.getSavedJobs();
            // Transform backend data to match frontend format
            const transformedJobs = savedJobsData.map(savedJob => ({
              ...savedJob.job,
              savedAt: savedJob.savedAt
            }));
            setSavedJobs(transformedJobs);
          } catch (error) {
            console.error('Error loading saved jobs from backend:', error);
            // Fallback to localStorage if backend fails
            const localSavedJobs = localStorage.getItem(`savedJobs_${user.userId}`);
            if (localSavedJobs) {
              try {
                setSavedJobs(JSON.parse(localSavedJobs));
              } catch (err) {
                console.error('Error loading saved jobs from localStorage:', err);
              }
            }
          }
        };

        loadAppliedJobs();
        loadSavedJobs();
      }
      
      // Load employer data
      if (user.role === 'employer') {
        const savedPostedJobs = localStorage.getItem(`postedJobs_${user.id}`);
        const savedAllApplications = localStorage.getItem(`allApplications_${user.id}`);
        
        if (savedPostedJobs) {
          try {
            setPostedJobs(JSON.parse(savedPostedJobs));
          } catch (error) {
            console.error('Error loading posted jobs:', error);
          }
        }
        
        if (savedAllApplications) {
          try {
            setAllApplications(JSON.parse(savedAllApplications));
          } catch (error) {
            console.error('Error loading applications:', error);
          }
        }
      }
    } else {
      // Clear data when user logs out
      setAppliedJobs([]);
      setSavedJobs([]);
      setPostedJobs([]);
      setAllApplications([]);
    }
  }, [user]);

  // Note: Applied jobs and saved jobs are now managed by the backend API, no need to save to localStorage

  // Save posted jobs to localStorage whenever it changes
  useEffect(() => {
    if (user && user.role === 'employer' && postedJobs.length >= 0) {
      localStorage.setItem(`postedJobs_${user.id}`, JSON.stringify(postedJobs));
    }
  }, [postedJobs, user]);

  // Save all applications to localStorage whenever it changes
  useEffect(() => {
    if (user && user.role === 'employer' && allApplications.length >= 0) {
      localStorage.setItem(`allApplications_${user.id}`, JSON.stringify(allApplications));
    }
  }, [allApplications, user]);

  const applyForJob = async (job, coverLetter = '') => {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') {
      return { success: false, error: 'Only job seekers can apply for jobs' };
    }

    // Check if profile is complete
    if (!user.profileComplete) {
      return { success: false, error: 'Please complete your profile before applying for jobs', requiresProfile: true };
    }

    const isAlreadyApplied = appliedJobs.some(appliedJob => appliedJob.id === job.id);
    if (isAlreadyApplied) {
      return { success: false, error: 'You have already applied for this job' };
    }

    try {
      // Call backend API
      const application = await jobApplicationService.applyForJob(job.id, coverLetter);

      // Update local state
      const applicationData = {
        ...job,
        appliedAt: application.appliedAt,
        status: application.status,
        applicationId: application.id,
        coverLetter: application.coverLetter
      };

      setAppliedJobs(prev => [...prev, applicationData]);

      // Update the applications count in the jobs list
      updateJobApplicationsCount(job.id, true);

      return { success: true, message: 'Application submitted successfully!' };
    } catch (error) {
      console.error('Error applying for job:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to apply for job' };
    }
  };

  const saveJob = async (job) => {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') {
      return { success: false, error: 'Only job seekers can save jobs' };
    }

    const isAlreadySaved = savedJobs.some(savedJob => savedJob.id === job.id);
    if (isAlreadySaved) {
      return { success: false, error: 'Job is already saved' };
    }

    try {
      // Call backend API
      await savedJobService.saveJob(job.id);

      // Update local state
      const savedJobData = {
        ...job,
        savedAt: new Date().toISOString()
      };

      setSavedJobs(prev => [...prev, savedJobData]);
      return { success: true, message: 'Job saved successfully!' };
    } catch (error) {
      console.error('Error saving job:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to save job' };
    }
  };

  const unsaveJob = async (jobId) => {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') {
      return { success: false, error: 'Only job seekers can unsave jobs' };
    }

    try {
      // Call backend API
      await savedJobService.unsaveJob(jobId);

      // Update local state
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      return { success: true, message: 'Job removed from saved jobs' };
    } catch (error) {
      console.error('Error unsaving job:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to unsave job' };
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.some(job => job.id === jobId);
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job.id === jobId);
  };

  const withdrawApplication = async (jobId) => {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') {
      return { success: false, error: 'Only job seekers can withdraw applications' };
    }

    const isApplied = appliedJobs.some(job => job.id === jobId);
    if (!isApplied) {
      return { success: false, error: 'You have not applied for this job' };
    }

    try {
      // Call backend API
      await jobApplicationService.withdrawApplication(jobId);

      // Update local state
      setAppliedJobs(prev => prev.filter(job => job.id !== jobId));

      // Update the applications count in the jobs list
      updateJobApplicationsCount(jobId, false);

      return { success: true, message: 'Application withdrawn successfully!' };
    } catch (error) {
      console.error('Error withdrawing application:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to withdraw application' };
    }
  };

  const getApplicationStatus = (jobId) => {
    const application = appliedJobs.find(job => job.id === jobId);
    return application?.status || null;
  };

  // Employer functions
  const postJob = (jobData) => {
    if (!user || user.role !== 'employer') {
      return { success: false, error: 'Only employers can post jobs' };
    }

    const newJob = {
      id: Date.now(),
      ...jobData,
      company: user.company,
      companyLogo: '🏢', // Default company logo
      postedBy: user.id,
      postedDate: new Date().toISOString(),
      applicationsCount: 0,
      featured: false,
      urgent: false
    };

    // Add to employer's personal job list
    setPostedJobs(prev => [...prev, newJob]);

    // Add to global jobs storage so it appears in main listings
    const existingGlobalJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
    localStorage.setItem('globalPostedJobs', JSON.stringify([...existingGlobalJobs, newJob]));

    return { success: true, message: 'Job posted successfully!', job: newJob };
  };

  const updateJob = (jobId, updates) => {
    if (!user || user.role !== 'employer') {
      return { success: false, error: 'Only employers can update jobs' };
    }

    setPostedJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    );
    return { success: true, message: 'Job updated successfully!' };
  };

  const deleteJob = (jobId) => {
    if (!user || user.role !== 'employer') {
      return { success: false, error: 'Only employers can delete jobs' };
    }

    // Remove from employer's personal job list
    setPostedJobs(prev => prev.filter(job => job.id !== jobId));

    // Remove from global jobs storage
    const existingGlobalJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
    const updatedGlobalJobs = existingGlobalJobs.filter(job => job.id !== jobId);
    localStorage.setItem('globalPostedJobs', JSON.stringify(updatedGlobalJobs));

    return { success: true, message: 'Job deleted successfully!' };
  };

  const getJobApplications = (jobId) => {
    const globalApplications = JSON.parse(localStorage.getItem('globalApplications') || '[]');
    return globalApplications.filter(app => app.jobId === parseInt(jobId));
  };

  const updateApplicationStatus = (applicationId, status) => {
    if (!user || user.role !== 'employer') {
      return { success: false, error: 'Only employers can update application status' };
    }

    // Update global applications
    const globalApplications = JSON.parse(localStorage.getItem('globalApplications') || '[]');
    const updatedApplications = globalApplications.map(app => 
      app.applicationId === applicationId 
        ? { ...app, applicant: { ...app.applicant, status } }
        : app
    );
    localStorage.setItem('globalApplications', JSON.stringify(updatedApplications));

    return { success: true, message: 'Application status updated!' };
  };

  // Get all jobs (static + posted) - synchronous helper
  const getAllJobsSync = (staticJobs) => {
    const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
    return [...staticJobs, ...globalPostedJobs];
  };

  const getJobByIdSync = (jobId, staticJobs) => {
    // Check static jobs first
    const staticJob = staticJobs.find(job => job.id === parseInt(jobId));
    if (staticJob) return staticJob;

    // Check posted jobs
    const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
    return globalPostedJobs.find(job => job.id === parseInt(jobId));
  };

  const value = {
    // Job seeker functionality
    appliedJobs,
    savedJobs,
    applyForJob,
    saveJob,
    unsaveJob,
    isJobApplied,
    isJobSaved,
    withdrawApplication,
    getApplicationStatus,
    totalAppliedJobs: appliedJobs.length,
    totalSavedJobs: savedJobs.length,

    // Employer functionality
    postedJobs,
    postJob,
    updateJob,
    deleteJob,
    getJobApplications,
    updateApplicationStatus,
    totalPostedJobs: postedJobs.length,

    // Global job helpers
    getAllJobsSync,
    getJobByIdSync
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};