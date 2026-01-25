package com.eazybytes.jobportal.client.service;

import com.eazybytes.jobportal.dto.TodoDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import java.util.List;

@HttpExchange// (url="https://jsonplaceholder.typicode.com/todos")
public interface TodoService {

    @GetExchange
    List<TodoDto> findAll();

    @GetExchange("/{id}")
    TodoDto findById(@PathVariable Long id);

    @PostExchange
    TodoDto create(@RequestBody TodoDto post);

    @PutExchange("/{id}")
    TodoDto update(@PathVariable Long id, @RequestBody TodoDto post);

    @DeleteExchange("/{id}")
    void delete(@PathVariable Long id);
}
