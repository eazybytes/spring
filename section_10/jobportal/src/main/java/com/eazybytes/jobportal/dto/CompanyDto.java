package com.eazybytes.jobportal.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CompanyDto(Long id, String name, String logo, String industry, String size, BigDecimal rating, String locations,
                         Integer founded, String description, Integer employees, String website,
                         Instant createdAt, List<JobDto> jobs) {
}
