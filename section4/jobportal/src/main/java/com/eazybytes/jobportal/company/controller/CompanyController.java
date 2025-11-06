package com.eazybytes.jobportal.company.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    @GetMapping(version = "1.0")
    public ResponseEntity<String> getAllCompanies() {
        return ResponseEntity.ok().body("Updated Companies List");
    }

}
