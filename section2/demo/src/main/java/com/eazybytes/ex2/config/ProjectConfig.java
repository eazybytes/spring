package com.eazybytes.ex2.config;

import com.eazybytes.ex2.beans.Vehicle;
import org.springframework.context.annotation.*;

@Configuration
@Import({AnotherProjectConfig.class})
public class ProjectConfig {

    @Bean(name = "audiVehicle")
    Vehicle vehicle1() {
        var veh = new Vehicle();
        veh.setName("Audi");
        return veh;
    }

    @Primary
    @Bean(value = "hondaVehicle")
    Vehicle vehicle2() {
        var veh = new Vehicle();
        veh.setName("Honda");
        return veh;
    }

    @Bean({"ferrariVehicle", "myFavouriteVehicle"})
    @Description("This is a Vehicle class bean")
    Vehicle vehicle3() {
        var veh = new Vehicle();
        veh.setName("Ferrari");
        return veh;
    }


}
