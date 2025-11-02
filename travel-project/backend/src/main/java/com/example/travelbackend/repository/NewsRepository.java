package com.example.travelbackend.repository;



import com.example.travelbackend.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

import java.util.Optional;

public interface NewsRepository extends JpaRepository<News, Long> {

    @EntityGraph(attributePaths = "author")
    Page<News> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "author")
    Page<News> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = "author")
    Optional<News> findWithAuthorById(Long id);
}
