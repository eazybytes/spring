package com.eazybytes.jobportal.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.ApiVersionConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configure API versioning for the application. In order for versioning to
     * be enabled, you must configure at least one way to resolve the API
     * version from a request (e.g. via request header).
     *
     * @param configurer
     * @since 7.0
     */
    @Override
    public void configureApiVersioning(ApiVersionConfigurer configurer) {
        configurer.useMediaTypeParameter(MediaType.parseMediaType("application/vnd.eazyapp+json"), "v")
                .addSupportedVersions("1.0","2.0","3.0").setDefaultVersion("1.0");
    }

    /**
     * Help with configuring {@link HandlerMapping} path matching options such as
     * whether to use parsed {@code PathPatterns} or String pattern matching
     * with {@code PathMatcher}, whether to match trailing slashes, and more.
     *
     * @param configurer
     * @see PathMatchConfigurer
     * @since 4.0.3
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/api",_ -> true);
    }

    /**
     * Configure "global" cross-origin request processing. The configured CORS
     * mappings apply to annotated controllers, functional endpoints, and static
     * resources.
     * <p>Annotated controllers can further declare more fine-grained config via
     * {@link CrossOrigin @CrossOrigin}.
     * In such cases "global" CORS configuration declared here is
     * {@link CorsConfiguration#combine(CorsConfiguration) combined}
     * with local CORS configuration defined on a controller method.
     *
     * @param registry
     * @see CorsRegistry
     * @see CorsConfiguration#combine(CorsConfiguration)
     * @since 4.2
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("*")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true).maxAge(3600);
    }
}
