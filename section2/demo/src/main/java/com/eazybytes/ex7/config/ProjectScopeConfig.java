package com.eazybytes.ex7.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"com.eazybytes.ex7.beans"})
public class ProjectScopeConfig {
}
