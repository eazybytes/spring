package com.example.main;

import com.example.beans.Vehicle;
import com.example.config.ProjectConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Example3 {

    public static void main(String[] args) {

        var context = new AnnotationConfigApplicationContext(ProjectConfig.class);

        Vehicle veh1 = context.getBean("audiVehicle",Vehicle.class);
        System.out.println("Vehicle name from Spring Context is: " + veh1.getName());
        // Output= Vehicle name from Spring Context is: Audi

        Vehicle veh2 = context.getBean("hondaVehicle",Vehicle.class);
        System.out.println("Vehicle name from Spring Context is: " + veh2.getName());
        // Output= Vehicle name from Spring Context is: Honda

        Vehicle veh3 = context.getBean("ferrariVehicle",Vehicle.class);
        System.out.println("Vehicle name from Spring Context is: " + veh3.getName());
        // Output= Vehicle name from Spring Context is: Ferrari
    }
}
