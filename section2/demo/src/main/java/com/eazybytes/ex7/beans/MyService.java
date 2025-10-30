package com.eazybytes.ex7.beans;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(BeanDefinition.SCOPE_SINGLETON) // Optional
@Lazy
public class MyService {

    public MyService() {
        System.out.println("MyService Bean is created");
    }

}
