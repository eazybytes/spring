package com.eazybytes.jobportal.job.controller;

import com.eazybytes.jobportal.dto.JobDto;
import com.eazybytes.jobportal.job.service.IJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final IJobService jobService;

    @GetMapping(path = "/employer", version = "1.0")
    public ResponseEntity<List<JobDto>> getEmployerJobs(Authentication authentication) {
        String employerEmail = authentication.getName();
        List<JobDto> jobs = jobService.getEmployerJobs(employerEmail);
        return ResponseEntity.ok(jobs);
    }

    @PostMapping(path = "/employer", version = "1.0")
    public ResponseEntity<JobDto> createJob(@RequestBody @Valid JobDto jobDto, Authentication authentication) {
        String employerEmail = authentication.getName();
        JobDto createdJob = jobService.createJob(jobDto, employerEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);

    }

    @PatchMapping("/{jobId}/status/employer")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> requestBody,
            Authentication authentication) {
        String employerEmail = authentication.getName();
        String status = requestBody.get("status");

        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Status is required"));
        }
        JobDto updatedJob = jobService.updateJobStatus(jobId, status.toUpperCase(), employerEmail);
        return ResponseEntity.ok(updatedJob);
    }

}
