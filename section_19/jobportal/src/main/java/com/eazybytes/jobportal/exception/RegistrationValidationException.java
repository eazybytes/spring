package com.eazybytes.jobportal.exception;

import java.util.Map;

public class RegistrationValidationException extends RuntimeException {

    private final Map<String, String> errors;

    public RegistrationValidationException(Map<String, String> errors) {
        super("Registration validation failed");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
