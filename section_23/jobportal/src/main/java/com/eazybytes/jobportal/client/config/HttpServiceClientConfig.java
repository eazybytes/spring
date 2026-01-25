package com.eazybytes.jobportal.client.config;

import com.eazybytes.jobportal.client.service.PostService;
import com.eazybytes.jobportal.client.service.TodoService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.support.RestClientHttpServiceGroupConfigurer;
import org.springframework.web.service.registry.ImportHttpServices;

@Configuration
@ImportHttpServices(group = "todos", types = {TodoService.class})
@ImportHttpServices(group = "posts", types = {PostService.class})
public class HttpServiceClientConfig {

    @Bean
    public RestClientHttpServiceGroupConfigurer groupConfigurer() {
            return groups -> {
                groups.filterByName("todos").forEachClient(
                        (group, restClientBuilder) -> {
                            restClientBuilder.baseUrl("https://jsonplaceholder.typicode.com/todos")
                                    .requestInterceptor((request, body, execution) -> {
                                        //request.getHeaders().setBearerAuth("Bearer Token");
                                        // request.getHeaders().add("Header Name", "Header Value");
                                        return execution.execute(request, body);
                                    }).build();
                        }
                );
                groups.filterByName("posts").forEachClient(
                        (group, restClientBuilder) -> {
                            restClientBuilder.baseUrl("https://jsonplaceholder.typicode.com/posts")
                                    .defaultHeader("Accept","application/json")
                                    .requestInterceptor((request, body, execution) -> {
                                        //request.getHeaders().setBearerAuth("Bearer Token");
                                        // request.getHeaders().add("Header Name", "Header Value");
                                        return execution.execute(request, body);
                                    }).build();
                        }
                );
            };
    }

}
