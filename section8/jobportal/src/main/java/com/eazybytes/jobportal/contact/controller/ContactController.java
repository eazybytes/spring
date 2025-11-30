package com.eazybytes.jobportal.contact.controller;

import com.eazybytes.jobportal.contact.service.IContactService;
import com.eazybytes.jobportal.dto.ContactRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final IContactService contactService;

    @PostMapping(version = "1.0")
    public ResponseEntity<String> saveContactMsg(@RequestBody @Valid ContactRequestDto contactRequestDto) {
        boolean isSaved =  contactService.saveContact(contactRequestDto);
        if (isSaved) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Request processed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Request processing failed");
        }
    }

    @GetMapping(version = "1.0")
    public ResponseEntity<String> fetchOpenContacts(@RequestParam
                                                        @Validated @NotBlank(message = "Status can not be blank")
                                                        @Size(min = 4,message = "Status lenght should be of minimum 4 chars") String status) {
        return ResponseEntity.ok("These are the contacts with the given status: " + status);
    }
}
