package com.eazybytes.jobportal.repository;

import com.eazybytes.jobportal.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}