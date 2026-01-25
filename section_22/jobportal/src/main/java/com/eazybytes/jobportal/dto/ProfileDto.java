package com.eazybytes.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record ProfileDto(
        Long id,
        Long userId,

        @NotBlank(message = "Job title is required")
        @Size(max = 255)
        String jobTitle,

        @NotBlank(message = "Location is required")
        @Size(max = 255)
        String location,

        @NotBlank(message = "Experience level is required")
        @Size(max = 50)
        String experienceLevel,

        @NotBlank(message = "Professional bio is required")
        String professionalBio,

        @Size(max = 500)
        String portfolioWebsite,

        // Profile Picture fields
        byte[] profilePicture,  // BLOB data
        String profilePictureName,
        String profilePictureType,

        // Resume fields
        byte[] resume,  // BLOB data
        String resumeName,
        String resumeType,

        Instant createdAt,
        Instant updatedAt
) {
}
