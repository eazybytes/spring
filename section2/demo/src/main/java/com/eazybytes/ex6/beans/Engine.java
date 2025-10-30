package com.eazybytes.ex6.beans;

public class Engine {

    private String name;

    public Engine() {
        System.out.println("Engine bean created by Spring");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Engine{" +
                "name='" + name + '\'' +
                '}';
    }
}
