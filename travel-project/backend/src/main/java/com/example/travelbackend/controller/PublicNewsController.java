package com.example.travelbackend.controller;

import com.example.travelbackend.dto.NewsResponse;
import com.example.travelbackend.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class PublicNewsController {

    private static final int MAX_PAGE_SIZE = 50;
    private final NewsService newsService;

    @GetMapping("/all")
    public Page<NewsResponse> list(@RequestParam(defaultValue="0") int page,
                                   @RequestParam(defaultValue="10") int size) {
        int pageSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        var pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        return newsService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponse> get(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(newsService.findById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
