package com.eazybytes.eazyschool.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class ProjectSecurityConfig {

    /**
     * From Spring Security 5.7, the WebSecurityConfigurerAdapter is deprecated to encourage users
     * to move towards a component-based security configuration. It is recommended to create a bean
     * of type SecurityFilterChain for security related configurations.
     *
     * @param http
     * @return SecurityFilterChain
     * @throws Exception
     */
    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {

        http.csrf().ignoringRequestMatchers("/saveMsg").ignoringRequestMatchers("/public/**")
                .ignoringRequestMatchers("/api/**").and()
                .authorizeHttpRequests()
                .requestMatchers("/dashboard").authenticated()
                .requestMatchers("/displayMessages/**").hasRole("ADMIN")
                .requestMatchers("/closeMsg/**").hasRole("ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/displayProfile").authenticated()
                .requestMatchers("/updateProfile").authenticated()
                .requestMatchers("/student/**").hasRole("STUDENT")
                .requestMatchers("/home").permitAll()
                .requestMatchers("/holidays/**").permitAll()
                .requestMatchers("/contact").permitAll()
                .requestMatchers("/saveMsg").permitAll()
                .requestMatchers("/courses").permitAll()
                .requestMatchers("/about").permitAll()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/logout").permitAll()
                .requestMatchers("/assets/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                .and().formLogin().loginPage("/login")
                .defaultSuccessUrl("/dashboard").failureUrl("/login?error=true").permitAll()
                .and().logout().logoutSuccessUrl("/login?logout=true").invalidateHttpSession(true).permitAll()
                .and().httpBasic();

            return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
