package com.eazybytes.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    // @GetMapping("/home")
    // @RequestMapping("/home")
    @RequestMapping(path = "/home", method = {RequestMethod.GET, RequestMethod.POST})
     // consumes = "application/json",produces = MediaType.APPLICATION_JSON_VALUE)
    public String sayHello() {
        return "Hello World!"; // JSON
    }

}
