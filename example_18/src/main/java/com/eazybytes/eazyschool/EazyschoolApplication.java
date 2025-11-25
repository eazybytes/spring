package com.eazybytes.eazyschool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.webmvc.autoconfigure.error.ErrorMvcAutoConfiguration;

//@SpringBootApplication(exclude = { ErrorMvcAutoConfiguration.class })
@SpringBootApplication
public class EazyschoolApplication {

    public static void main(String[] args) {
        SpringApplication.run(EazyschoolApplication.class, args);
    }

}
