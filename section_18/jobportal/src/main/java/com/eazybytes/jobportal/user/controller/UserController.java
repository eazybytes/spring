package com.eazybytes.jobportal.user.controller;

import com.eazybytes.jobportal.dto.UserDto;
import com.eazybytes.jobportal.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/search/admin")
    public ResponseEntity<?> searchUserByEmail(@RequestParam String email) {
        Optional<UserDto> userOptional = userService.searchUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found with email: " + email));
        }
        return ResponseEntity.ok(userOptional.get());
    }

    @PatchMapping("/{userId}/role/employer/admin")
    public ResponseEntity<?> elevateToEmployer(@PathVariable Long userId) {
        UserDto updatedUser = userService.elevateToEmployer(userId);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{userId}/company/{companyId}/admin")
    public ResponseEntity<?> assignCompanyToEmployer(
            @PathVariable Long userId, @PathVariable Long companyId) {
        UserDto updatedUser = userService.assignCompanyToEmployer(userId, companyId);
        return ResponseEntity.ok(updatedUser);
    }

}
