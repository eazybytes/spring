package com.eazybytes.jobportal.dto;

public record LoginResponseDto(String message, UserDto user, String jwtToken) {
}
