package com.eazybytes.jobportal.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CompanyDto(
                          Long id,

                         @NotBlank(message = "Name can not be empty")
                         String name,

                         @NotBlank(message = "Logo can not be empty")
                         String logo,

                         @NotBlank(message = "Industry can not be empty")
                         String industry,

                         @NotBlank(message = "Size can not be empty")
                         String size,

                         @DecimalMin(value = "0.0", message = "Rating must be at least 0")
                         @DecimalMax(value = "5.0", message = "Rating must be at most 5")
                         BigDecimal rating,

                         @NotBlank(message = "Locations can not be empty")
                         String locations,

                         @Min(value = 1900, message = "Founded must be 1900 or later")
                         Integer founded,

                         @NotBlank(message = "Description can not be empty")
                         String description,

                         @Min(value = 1, message = "Employees must be greater than or equal to 1")
                         Integer employees,

                         @NotBlank(message = "Website can not be empty")
                         String website,

                         Instant createdAt, List<JobDto> jobs) {
}
