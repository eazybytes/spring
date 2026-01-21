package com.eazybytes.jobportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @NotBlank(message = "Name is required")
        @Size(min = 5, max = 30, message = "The length of the name should be between 5 and 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email address must be a valid value")
        String email,

        @NotBlank(message = "Mobile Number is required")
        @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be exactly 10 digits")
        String mobileNumber,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 20, message = "Password length must be between 8 and 50 characters")
        String password
) {
}
