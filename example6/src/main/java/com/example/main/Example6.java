package com.example.main;

import com.example.beans.Vehicle;
import com.example.config.ProjectConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Example6 {

    public static void main(String[] args) {

        var context = new AnnotationConfigApplicationContext
                      (ProjectConfig.class);
        Vehicle vehicle = context.getBean(Vehicle.class);
        System.out.println("Component Vehicle name from " +
                "Spring Context is: " + vehicle.getName());
        //Output= Component Vehicle name from Spring Context is: Honda
        vehicle.printHello();
        //Output= Destroying Vehicle Bean
        context.close();

    }
}
