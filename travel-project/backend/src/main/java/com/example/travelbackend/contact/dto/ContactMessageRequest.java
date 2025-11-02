package com.example.travelbackend.contact.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactMessageRequest {
    // For guests; ignored if user is logged in
    @NotBlank @Size(max = 100)
    public String name;

    @NotBlank @Email @Size(max = 255)
    public String email;

    @NotBlank @Size(max = 150)
    public String subject;

    @NotBlank @Size(max = 4000)
    public String content;
}
