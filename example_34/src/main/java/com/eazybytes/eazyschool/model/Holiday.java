package com.eazybytes.eazyschool.model;

import lombok.Data;

@Data
public class Holiday extends BaseEntity {

    private String day;
    private String reason;
    private Type type;

    public enum Type {
        FESTIVAL, FEDERAL
    }
}
