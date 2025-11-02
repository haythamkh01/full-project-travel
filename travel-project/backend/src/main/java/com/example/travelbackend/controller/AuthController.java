package com.example.travelbackend.controller;

import com.example.travelbackend.dto.LoginRequest;
import com.example.travelbackend.dto.RegisterRequest;
import com.example.travelbackend.entity.User;
import com.example.travelbackend.service.UserService;
import com.example.travelbackend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class AuthController {

    private final UserService userService;

    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok("User registered successfully!-backend");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {

        User user = userService.login(request); // your method that returns a User object

        // ✅ Generate real JWT
        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Welcome " + user.getName());
        response.put("name", user.getName());
        response.put("role", user.getRole()); // ✅ Send role
        response.put("email", user.getEmail()); // ✅ Optional
        response.put("id", String.valueOf(user.getId()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }
}