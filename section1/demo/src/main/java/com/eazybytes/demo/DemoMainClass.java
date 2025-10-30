package com.eazybytes.demo;

import com.eazybytes.demo.beans.Vehicle;
import com.eazybytes.demo.config.ProjectConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class DemoMainClass {

    static void main() {
        Vehicle vehicle = new Vehicle();
        vehicle.setName("Audi");
        System.out.println("Vehicle name from non-spring context is: " + vehicle.getName());

        var context = new AnnotationConfigApplicationContext(ProjectConfig.class);
        var veh = context.getBean(Vehicle.class);
        System.out.println("Vehicle name from Spring Context is: " + veh.getName());

        /*
        We don’t need to do any explicit casting while fetching a bean from context.
        Spring is smart enough to look for a bean of the type you requested in its context.
        If such a bean doesn’t exist,Spring will throw an exception.
        * */
        String hello = context.getBean(String.class);
        System.out.println("String value  from Spring Context is: " + hello);

        Integer num = context.getBean(Integer.class);
        System.out.println("Integer value  from Spring Context is: " + num);

        String hello1 = (String) context.getBean("hello");
        System.out.println("String value  from Spring Context is: " + hello1);

        // context.getBean(Double.class);
    }
}
