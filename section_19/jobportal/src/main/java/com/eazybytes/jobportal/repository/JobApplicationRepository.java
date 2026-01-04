package com.eazybytes.jobportal.repository;

import com.eazybytes.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    // Delete an application by user ID and job ID
    void deleteByUserIdAndJobId(Long userId, Long jobId);

    // Find all applications by user ID
    List<JobApplication> findByUserIdOrderByAppliedAtDesc(Long userId);
}