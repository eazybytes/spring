package com.eazybytes.ex6.beans;

public class Bike {

    private String name;

    public Bike() {
        System.out.println("Bike bean created");
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Bike{" +
                "name='" + name + '\'' +
                '}';
    }
}
