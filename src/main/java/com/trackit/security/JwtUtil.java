package com.trackit.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    // ✅ >= 256-bit secret for HS256
    private static final String SECRET =
            "trackittrackittrackittrackit123456";

    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    private final Key key = Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
    );

    // --------------------------------------------------
    // ✅ TOKEN GENERATION
    // --------------------------------------------------
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // ✅ role WITHOUT "ROLE_"
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // --------------------------------------------------
    // ✅ TOKEN VALIDATION
    // --------------------------------------------------
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // --------------------------------------------------
    // ✅ CLAIM EXTRACTION
    // --------------------------------------------------
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // --------------------------------------------------
    // ✅ INTERNAL HELPERS
    // --------------------------------------------------
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}