package com.eazybytes.eazyschool.model;

import lombok.Data;

import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@MappedSuperclass
public class BaseEntity {

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
