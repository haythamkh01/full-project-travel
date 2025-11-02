package com.example.travelbackend.contact;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findAllByStatus(MessageStatus status, Pageable pageable);
    long countByStatus(MessageStatus status);
}

