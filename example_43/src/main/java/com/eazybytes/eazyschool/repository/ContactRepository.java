package com.eazybytes.eazyschool.repository;

import com.eazybytes.eazyschool.model.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
@Repository stereotype annotation is used to add a bean of this class
type to the Spring context and indicate that given Bean is used to perform
DB related operations and
* */
@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {

    List<Contact> findByStatus(String status);

    Page<Contact> findByStatus(String status, Pageable pageable);

}
