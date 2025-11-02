package com.example.travelbackend.contact.dto;


import com.example.travelbackend.contact.MessageStatus;

import java.time.Instant;

public record ContactMessageResponse(
        Long id,
        Long userId,
        String name,
        String email,
        String subject,
        String content,
        Instant createdAt,
        MessageStatus status,
        String adminNote
) {}
