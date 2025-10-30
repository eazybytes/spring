package com.eazybytes.ex3.beans;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

@Component
public class Vehicle implements InitializingBean, DisposableBean {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void sayHello() {
        System.out.println("Printing Hello from Component Vehicle Bean");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.name = "Tesla";
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("Destroying Vehicle Bean");
    }

//    @PostConstruct
//    public void initialize() {
//        this.name = "Audi";
//    }

//    @PreDestroy
//    public void destroy() {
//        System.out.println("Destroying Vehicle Bean");
//    }

}
