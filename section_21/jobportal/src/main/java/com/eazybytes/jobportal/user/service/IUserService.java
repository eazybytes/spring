package com.eazybytes.jobportal.user.service;

import com.eazybytes.jobportal.dto.ApplyJobRequestDto;
import com.eazybytes.jobportal.dto.JobApplicationDto;
import com.eazybytes.jobportal.dto.JobDto;
import com.eazybytes.jobportal.dto.ProfileDto;
import com.eazybytes.jobportal.dto.UserDto;
import com.eazybytes.jobportal.entity.Profile;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    /**
     * Search for a user by email address
     * @param email the email address to search for
     * @return Optional containing UserDto if found
     */
    Optional<UserDto> searchUserByEmail(String email);

    /**
     * Elevate a user's role to ROLE_EMPLOYER
     * @param userId the ID of the user to elevate
     * @return updated UserDto
     */
    UserDto elevateToEmployer(Long userId);

    /**
     * Assign a company to an employer
     * @param userId the ID of the employer
     * @param companyId the ID of the company to assign
     * @return updated UserDto
     */
    UserDto assignCompanyToEmployer(Long userId, Long companyId);

    ProfileDto createOrUpdateProfile(String userEmail, String profileJson,
            MultipartFile profilePicture, MultipartFile resume) throws JsonProcessingException;

    ProfileDto getProfile(String userEmail);

    ProfileDto getProfilePicture(String userEmail);

    ProfileDto getResume(String userEmail);
	
    JobDto saveJob(String userEmail, Long jobId);

    void unsaveJob(String userEmail, Long jobId);

    List<JobDto> getSavedJobs(String userEmail);

    JobApplicationDto applyForJob(String userEmail, ApplyJobRequestDto request);

    void withdrawApplication(String userEmail, Long jobId);

    List<JobApplicationDto> getJobSeekerApplications(String userEmail);
}
