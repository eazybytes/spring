package com.eazybytes.jobportal.dto;

public record TodoDto(Long userId, Long id, String title, boolean completed) {
}
