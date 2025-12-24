package com.eazybytes.jobportal.repository;

import com.eazybytes.jobportal.entity.Company;
import com.eazybytes.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Optional
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT DISTINCT c FROM Company c JOIN FETCH c.jobs j WHERE j.status = :status")
    List<Company> findAllWithJobsByStatus(@Param("status") String status);

    List<Company> fetchCompaniesWithJobsByStatus(@Param("status") String status);

    @Query(value = "SELECT DISTINCT c.* FROM companies c JOIN jobs j ON c.id = j.company_id WHERE j.status = ?",
            nativeQuery = true)
    List<Company> findAllWithJobsByStatusNative(String status);

    List<Company> fetchCompaniesWithJobsByStatusNative(String status);

}
