package com.eazybytes.jobportal.aspects;

import com.eazybytes.jobportal.dto.LoginResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoginSuccessAuditAspect {

    @AfterReturning(
            pointcut = "execution(* com.eazybytes.jobportal.auth.AuthController.apiLogin(..))",
            returning = "response"
    )
    public void logSuccessfulLogin(JoinPoint joinPoint, Object response) {

        if (!(response instanceof ResponseEntity<?> responseEntity)) {
            return;
        }
        Object body = responseEntity.getBody();
        if (!(body instanceof LoginResponseDto loginResponse)) {
            return;
        }
        // Only log if login is really successful
        if (loginResponse.user() != null) {
            String username = loginResponse.user().getEmail(); // or username
            String role = loginResponse.user().getRole();
            log.info("✅ LOGIN SUCCESS | User: {} | Role: {}", username, role);
        }
    }

}
