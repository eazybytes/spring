package com.eazybytes.jobportal.contact.service;

import com.eazybytes.jobportal.dto.ContactRequestDto;
import com.eazybytes.jobportal.dto.ContactResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IContactService {

    boolean saveContact(ContactRequestDto contactRequestDto);

    List<ContactResponseDto> fetchNewContactMsgs();

    List<ContactResponseDto> fetchNewContactMsgsWithSort(String sortBy, String sortDir);

    Page<ContactResponseDto> fetchNewContactMsgsWithPaginationAndSort(int pageNumber, int pageSize,
            String sortBy, String sortDir);

    boolean closeContactMsg(Long id, String status);

}
