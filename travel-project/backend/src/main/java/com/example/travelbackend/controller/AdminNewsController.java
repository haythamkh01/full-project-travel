package com.example.travelbackend.controller;

import com.example.travelbackend.dto.NewsResponse;
import com.example.travelbackend.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
public class AdminNewsController {

    private final NewsService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> create(
            @RequestPart String title,
            @RequestPart String content,
            @RequestPart(required = false) String authorName,
            @RequestPart(required = false) MultipartFile image
    ) throws Exception {
        var res = service.create(title, content, authorName, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PatchMapping(path="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public NewsResponse update(@PathVariable Long id,
                               @RequestPart(required = false) String title,
                               @RequestPart(required = false) String content,
                               @RequestPart(required = false) String authorName,
                               @RequestPart(required = false) MultipartFile image) throws Exception {
        return service.update(id, title, content, authorName, image);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
