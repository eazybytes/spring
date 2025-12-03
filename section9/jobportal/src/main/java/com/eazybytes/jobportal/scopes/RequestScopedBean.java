package com.eazybytes.jobportal.scopes;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Getter @Setter
public class RequestScopedBean {

    private String username;

    public RequestScopedBean() {
        System.out.println("RequestScopedBean created");
    }

}
