package com.example.travelbackend.service;

import com.example.travelbackend.dto.NewsResponse;
import com.example.travelbackend.entity.News;
import com.example.travelbackend.entity.User;
import com.example.travelbackend.files.ImageStorageService;
import com.example.travelbackend.repository.NewsRepository;
import com.example.travelbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository repo;
    private final ImageStorageService storage;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("No authenticated user");
        }
        String username = auth.getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
    }

    @Transactional
    public NewsResponse create(String title, String content, String authorName, MultipartFile image) throws Exception {
        User current = getCurrentUser();

        News n = new News();
        n.setTitle(title.trim());
        n.setContent(content);
        n.setAuthor(current);

        String display = (authorName != null && !authorName.isBlank())
                ? authorName
                : (current.getName() != null ? current.getName() : current.getEmail());
        n.setAuthorName(display);

        if (image != null && !image.isEmpty()) {
            n.setImageUrl(storage.saveNewsImage(image));
        }

        return NewsResponse.from(repo.save(n));
    }

    @Transactional(readOnly = true)
    public Page<NewsResponse> findAll(Pageable pageable) {
        return repo.findAllByOrderByCreatedAtDesc(pageable).map(NewsResponse::from);
    }

    @Transactional(readOnly = true)
    public NewsResponse findById(Long id) {
        News n = repo.findWithAuthorById(id)
                .orElseThrow(() -> new IllegalArgumentException("News not found"));
        return NewsResponse.from(n);
    }

    @Transactional
    public NewsResponse update(Long id, String title, String content, String authorName, MultipartFile image) throws Exception {
        News n = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("News not found"));

        if (title != null && !title.isBlank()) n.setTitle(title.trim());
        if (content != null) n.setContent(content);

        if (authorName != null) {
            String fallback = n.getAuthor() != null
                    ? (n.getAuthor().getName() != null ? n.getAuthor().getName() : n.getAuthor().getEmail())
                    : null;
            n.setAuthorName(authorName.isBlank() ? fallback : authorName);
        }

        if (image != null && !image.isEmpty()) {
            n.setImageUrl(storage.saveNewsImage(image));
        }

        return NewsResponse.from(repo.save(n));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("News not found");
        }
        repo.deleteById(id);
    }
}
