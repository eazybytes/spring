package com.eazybytes.jobportal.client.controller;

import com.eazybytes.jobportal.client.service.PostService;
import com.eazybytes.jobportal.dto.PostDto;
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
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @GetMapping
    ResponseEntity<List<PostDto>> findAll() {
        return ResponseEntity.ok(postService.findAll());
    }

    @GetMapping("/{id}")
    ResponseEntity<PostDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    @PostMapping
    ResponseEntity<PostDto> create(@RequestBody PostDto postDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(postDto));
    }

    @PutMapping("/{id}")
    ResponseEntity<PostDto> update(@PathVariable Long id, @RequestBody PostDto postDto) {
        return ResponseEntity.status(HttpStatus.OK).body(postService.update(id, postDto));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<String> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("Post deleted successfully");
    }
}
