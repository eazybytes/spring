package com.eazybytes.jobportal.job.service;

import com.eazybytes.jobportal.dto.JobApplicationDto;
import com.eazybytes.jobportal.dto.JobDto;
import com.eazybytes.jobportal.dto.UpdateJobApplicationDto;

import java.util.List;

public interface IJobService {

    /**
     * Get all jobs posted by the employer's company
     * @param employerEmail the email of the employer
     * @return list of jobs
     */
    List<JobDto> getEmployerJobs(String employerEmail);

    /**
     * Update the status of a job
     * @param jobId the ID of the job
     * @param status the new status (ACTIVE, CLOSED, DRAFT)
     * @param employerEmail the email of the employer making the request
     * @return updated JobDto
     */
    JobDto updateJobStatus(Long jobId, String status, String employerEmail);

    /**
     * Create a new job for the employer's company
     * @param jobDto the job data
     * @param employerEmail the email of the employer creating the job
     * @return created JobDto
     */
    JobDto createJob(JobDto jobDto, String employerEmail);

    /**
     * Retrieves a list of job applications submitted for a specific job
     *
     * @param jobId the ID of the job for which applications need to be retrieved
     * @return a list of job applications submitted for the specified job
     */
    List<JobApplicationDto> getApplicationsByJobForEmployer(Long jobId);

    /**
     * Updates an existing job application with the provided details.
     *
     * @param updateJobApplicationDto the data transfer object containing
     *                                the details to update the job application,
     *                                such as the application ID, status, and notes.
     * @return true if the job application was successfully updated; false otherwise.
     */
    boolean updateJobApplication(UpdateJobApplicationDto updateJobApplicationDto);

}
