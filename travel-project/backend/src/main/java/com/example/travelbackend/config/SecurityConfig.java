package com.example.travelbackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public access
                        .requestMatchers("/api/admin/login").permitAll()

                        // If you still allow signup (maybe for super admin creation only)
                        .requestMatchers("/api/admin/signup").permitAll()

                        // Protected: allow only authenticated users with ADMIN role
                        .requestMatchers("/api/news/add", "/api/news/delete/**").authenticated()

                        // News is public
                        .requestMatchers("/api/news/all").permitAll()

                        // Other admin APIs require authentication
                        .requestMatchers("/api/admin/**").authenticated()
                        // Public "Contact Us" POST
                        .requestMatchers(HttpMethod.POST, "/api/contact-messages").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // allow preflight


                        .anyRequest().permitAll()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
