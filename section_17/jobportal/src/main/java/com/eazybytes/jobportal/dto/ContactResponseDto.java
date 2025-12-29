package com.eazybytes.jobportal.dto;

import java.time.Instant;

public record ContactResponseDto(
        Long id, String name, String email,
        String userType, String subject, String message,
        String status, Instant createdAt
) {
}
