package com.eazybytes.eazyschool.model;

import lombok.Data;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.lang.annotation.Inherited;
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
