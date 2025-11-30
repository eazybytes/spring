package com.eazybytes.jobportal.company.service;

import com.eazybytes.jobportal.dto.CompanyDto;
import com.eazybytes.jobportal.entity.Company;

import java.util.List;

public interface ICompanyService {

    List<CompanyDto> getAllCompanies();

}
