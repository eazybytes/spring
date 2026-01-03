package com.eazybytes.jobportal.audit;

import com.eazybytes.jobportal.util.ApplicationUtility;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of(ApplicationUtility.getLoggedInUser());
    }
}
