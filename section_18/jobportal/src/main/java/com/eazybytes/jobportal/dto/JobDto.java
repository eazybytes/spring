package com.eazybytes.jobportal.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public record JobDto(
        Long id,

        @NotBlank(message = "Job title is required")
        String title,

        Long companyId,
        String companyName,
        String companyLogo,

        @NotBlank(message = "Job location is required")
        String location,

        @NotBlank(message = "Work type is required")
        String workType,

        @NotBlank(message = "Job type is required")
        String jobType,

        @NotBlank(message = "Category is required")
        String category,

        @NotBlank(message = "Experience level is required")
        String experienceLevel,

        @NotNull(message = "Minimum salary is required")
        @DecimalMin(value = "0.0", message = "Minimum salary must be positive")
        BigDecimal salaryMin,

        @NotNull(message = "Maximum salary is required")
        @DecimalMin(value = "0.0", message = "Maximum salary must be positive")
        BigDecimal salaryMax,

        @NotBlank(message = "Salary currency is required")
        String salaryCurrency,

        @NotBlank(message = "Salary period is required")
        String salaryPeriod,

        @NotBlank(message = "Job description is required")
        String description,

        String requirements,
        String benefits,
        Instant postedDate,
        Instant applicationDeadline,
        Integer applicationsCount,
        Boolean featured,
        Boolean urgent,
        Boolean remote,
        String status
) implements Serializable {
}
