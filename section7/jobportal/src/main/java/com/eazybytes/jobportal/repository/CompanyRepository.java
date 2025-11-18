package com.eazybytes.jobportal.repository;

import com.eazybytes.jobportal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Optional
public interface CompanyRepository extends JpaRepository<Company, Long> {
}
