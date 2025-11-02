package com.example.travelbackend.service;


import com.example.travelbackend.dto.LoginRequest;
import com.example.travelbackend.dto.RegisterRequest;
import com.example.travelbackend.entity.User;
import com.example.travelbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber()); // NEW
        user.setRole("USER");

        userRepository.save(user);
    }


    // in com.example.learnsystem.service.UserService
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user; // ✅ Must return User object
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User createUser(User user) {
        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }


    public void generateResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String token = UUID.randomUUID().toString(); // Generate token
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15)); // Valid for 15 min
        userRepository.save(user);

        // Simulate sending by printing (in real case, send via email)
        System.out.println("🔐 Password reset token for " + email + ": " + token);
    }
}