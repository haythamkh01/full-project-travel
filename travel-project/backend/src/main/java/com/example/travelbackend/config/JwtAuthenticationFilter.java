package com.example.travelbackend.config;

import com.example.travelbackend.service.CustomUserDetailsService;
import com.example.travelbackend.util.JwtUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;

        System.out.println("🔍 JwtAuthenticationFilter triggered");
        System.out.println("📥 Incoming Auth Header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("✅ Username extracted from token: " + username);
            } catch (Exception e) {
                System.out.println("❌ Failed to extract username from token: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            System.out.println("✅ Loaded user from DB: " + userDetails.getUsername());
            System.out.println("🧾 Authorities: " + userDetails.getAuthorities());

            if (jwtUtil.validateToken(token, userDetails)) {
                System.out.println("✅ Token is valid. Setting authentication.");

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("❌ Token is invalid or expired.");
            }
        } else if (username == null) {
            System.out.println("⚠️ No username extracted. Possibly no token or malformed token.");
        }

        filterChain.doFilter(request, response);
    }

}