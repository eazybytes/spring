package com.example.beans;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;


@Component
public class Vehicle {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @PostConstruct
    public void initialize() {
        this.name = "Honda";
    }

    @PreDestroy
    public void destroy() {
        System.out.println(
                "Destroying Vehicle Bean");
    }

/*  @PostConstruct: This annotation is used on a method that needs
    to be executed after dependency injection and before the bean
    is put into service. It's often used for initialization tasks.
    When the bean's dependencies are injected and the bean is fully constructed,
    the method annotated with @PostConstruct will be invoked.

    @PreDestroy: This annotation is used on a method that needs
    to be executed just before the bean is removed from the container.
    It's often used for clean-up tasks. When the application
    or container is shutting down or the bean is being removed
    from the context, the method annotated with @PreDestroy will be invoked. */

    public void printHello(){
        System.out.println(
            "Printing Hello from Component Vehicle Bean");
    }
}
