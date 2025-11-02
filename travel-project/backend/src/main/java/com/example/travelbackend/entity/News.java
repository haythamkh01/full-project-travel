package com.example.travelbackend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "news")
public class News {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=180)
    private String title;

    @Lob @Column(nullable=false)
    private String content;

    @Column(name="image_url", length=512)
    private String imageUrl;

    // If you still have old rows, make this nullable=true temporarily, then backfill.
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "author_id", nullable = true)
    private User author;

    // Display name shown in UI (can default to author's real name)
    @Column(name="author_display_name", length=180)
    private String authorName;

    @CreationTimestamp
    @Column(updatable=false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // getters & setters...
    // (omit for brevity)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
