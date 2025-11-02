package com.example.travelbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format-backend")
    private String email;
    @NotBlank(message = "Password is required-backend")
    @Size(min = 8, message = "Password must be at least 8 characters long-backend")
    private String password;

    @NotBlank(message = "Please confirm your password-backend")
    private String confirmPassword;

    private String phoneNumber;

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String email, String password, String confirmPassword, String phoneNumber) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword=confirmPassword;
        this.phoneNumber=phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
