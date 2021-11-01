package com.example.config;

import com.example.beans.Vehicle;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProjectConfig {

    @Bean
    Vehicle getVehicle() {
        var veh = new Vehicle();
        veh.setName("Audi 8");
        return veh;
    }
}
