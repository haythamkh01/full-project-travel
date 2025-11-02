package com.example.travelbackend.dto;

import com.example.travelbackend.entity.News;
import java.time.Instant;

public record NewsResponse(
        Long id,
        String title,
        String content,
        String imageUrl,
        String authorName,
        Long authorId,
        Instant createdAt,
        Instant updatedAt
) {
    public static NewsResponse from(News n) {
        return new NewsResponse(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getImageUrl(),
                n.getAuthorName(),
                n.getAuthor() != null ? n.getAuthor().getId() : null,
                n.getCreatedAt(),
                n.getUpdatedAt()
        );
    }
}
