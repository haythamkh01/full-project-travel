package com.example.travelbackend.files;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Service
public class ImageStorageService {
    private final Path root = Paths.get("uploads/news");

    public String saveNewsImage(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) return null;

        Files.createDirectories(root);
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse("");
        String name = UUID.randomUUID() + ext;

        Path target = root.resolve(name).normalize();
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // Returned value should match how you serve static files (e.g. via WebMvc config)
        return "/uploads/news/" + name;
    }
}
