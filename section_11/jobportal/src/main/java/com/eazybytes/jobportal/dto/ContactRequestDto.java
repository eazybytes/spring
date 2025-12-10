package com.eazybytes.jobportal.dto;

import jakarta.validation.constraints.*;

import java.io.Serializable;

/**
 * DTO for {@link com.eazybytes.jobportal.entity.Contact}
 */
public record ContactRequestDto(

        @NotBlank(message = "Email can not be empty")
        @Email(message = "Invalid email address")
        String email,

        @NotBlank(message = "Message can not be empty")
        @Size(min = 5, max = 500, message = "Message must be between 5 and 500 characters")
        String message,

        @NotBlank(message = "Name can not be empty")
        @Size(min = 5, max = 30, message = "Name must be between 5 and 30 characters")
        String name,

        @NotBlank(message = "Subject can not be empty")
        @Size(min = 5, max = 150, message = "Subject must be between 5 and 150 characters")
        String subject,

        @NotBlank(message = "UserType can not be empty")
        @Pattern(regexp = "Job Seeker|Employer|Other", message = "UserType must be one of: Job Seeker, Employer, Other")
        String userType

    ) implements Serializable {
}