package com.eazybytes.jobportal.security.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.cors")
@Getter @Setter
public class CorsProperties {

    /**
     * List of allowed origins (e.g., http://localhost:5173, https://example.com)
     */
    private List<String> allowedOrigins;

    /**
     * List of allowed HTTP methods (e.g., GET, POST, PUT, DELETE)
     * Use "*" to allow all methods
     */
    private List<String> allowedMethods;

    /**
     * List of allowed headers
     * Use "*" to allow all headers
     */
    private List<String> allowedHeaders;

    /**
     * Whether to allow credentials (cookies, authorization headers)
     */
    private Boolean allowCredentials;

    /**
     * Maximum age (in seconds) for pre-flight request caching
     */
    private Long maxAge;
}
