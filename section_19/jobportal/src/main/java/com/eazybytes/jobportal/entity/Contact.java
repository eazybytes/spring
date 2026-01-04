package com.eazybytes.jobportal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@NamedQueries({
        @NamedQuery(name= "Contact.updateStatusById",
        query = "UPDATE Contact c SET c.status = :status, c.updatedAt = CURRENT_TIMESTAMP, c.updatedBy = :updatedBy WHERE c.id = :id")
})
@Table(name = "contacts")
public class Contact extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Lob
    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "name", nullable = false)
    private String name;

    @ColumnDefault("'NEW'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "user_type", nullable = false, length = 50)
    private String userType;

}