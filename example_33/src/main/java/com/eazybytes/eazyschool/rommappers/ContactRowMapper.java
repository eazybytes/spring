package com.eazybytes.eazyschool.rommappers;

import com.eazybytes.eazyschool.model.Contact;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ContactRowMapper implements RowMapper<Contact> {

    @Override
    public Contact mapRow(ResultSet rs, int rowNum) throws SQLException {
        Contact contact = new Contact();
        contact.setContactId(rs.getInt("CONTACT_ID"));
        contact.setName(rs.getString("NAME"));
        contact.setMobileNum(rs.getString("MOBILE_NUM"));
        contact.setEmail(rs.getString("EMAIL"));
        contact.setSubject(rs.getString("SUBJECT"));
        contact.setMessage(rs.getString("MESSAGE"));
        contact.setStatus(rs.getString("STATUS"));
        contact.setCreatedAt(rs.getTimestamp("CREATED_AT").toLocalDateTime());
        contact.setCreatedBy(rs.getString("CREATED_BY"));

        if(null!=rs.getTimestamp("UPDATED_AT")){
            contact.setUpdatedAt(rs.getTimestamp("UPDATED_AT").toLocalDateTime());
        }
        contact.setUpdatedBy(rs.getString("UPDATED_BY"));
        return contact;
    }
}
