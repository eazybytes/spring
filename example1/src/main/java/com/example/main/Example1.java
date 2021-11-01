package com.example.main;

import com.example.beans.Vehicle;
import com.example.config.ProjectConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Example1 {

    public static void main(String[] args) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName("Honda City");
        System.out.println(vehicle.getName());
        var context = new AnnotationConfigApplicationContext(ProjectConfig.class);
        Vehicle veh = context.getBean(Vehicle.class);
        System.out.println(veh.getName());
    }
}
