
package com.example.travelbackend.contact;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

// Replace with your real UserService / principal details
@Component
public class CurrentUserLookup {
    public record MiniUser(Long id, String name, String email) {}

    public MiniUser get(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        // Example if your principal username is the email and you can load user by email:
        // var user = userRepository.findByEmail(auth.getName()).orElse(null);
        // return (user == null) ? null : new MiniUser(user.getId(), user.getFullName(), user.getEmail());
        return null; // TODO: implement using your existing user service
    }
}
