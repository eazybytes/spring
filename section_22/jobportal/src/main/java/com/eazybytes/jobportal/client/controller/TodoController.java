package com.eazybytes.jobportal.client.controller;

import com.eazybytes.jobportal.client.service.RestClientTodoService;
import com.eazybytes.jobportal.client.service.TodoService;
import com.eazybytes.jobportal.dto.TodoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/todos")
public class TodoController {

    private final RestClientTodoService restClientTodoService;
    private final TodoService todoService;

    @GetMapping
    ResponseEntity<List<TodoDto>> findAll() {
        // return ResponseEntity.ok(restClientTodoService.findAll());
        return ResponseEntity.ok(todoService.findAll());
    }

    @GetMapping("/{id}")
    ResponseEntity<TodoDto> findById(@PathVariable Long id) {
        // return ResponseEntity.ok(restClientTodoService.findById(id));
        return ResponseEntity.ok(todoService.findById(id));
    }

    @PostMapping
    ResponseEntity<TodoDto> create(@RequestBody TodoDto toDoDto) {
        // return ResponseEntity.status(HttpStatus.CREATED).body(restClientTodoService.create(toDoDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(todoService.create(toDoDto));
    }

    @PutMapping("/{id}")
    ResponseEntity<TodoDto> update(@PathVariable Long id, @RequestBody TodoDto toDoDto) {
        // return ResponseEntity.status(HttpStatus.OK).body(restClientTodoService.update(id, toDoDto));
        return ResponseEntity.status(HttpStatus.OK).body(todoService.update(id, toDoDto));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<String> delete(@PathVariable Long id) {
        // restClientTodoService.delete(id);
        todoService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("ToDo deleted successfully");
    }
}
