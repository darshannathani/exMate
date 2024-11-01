package com.exMate.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.stream.Collectors;

// Update JwtTokenProvider.java
@Component
public class JwtTokenProvider {

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // Remove the old jwtSecret string and encodedSecretKey
    // Instead, create a single secret key for all operations
    private final Key key;

    public JwtTokenProvider(@Value("${app.jwtSecret}") String secret) {
        // Generate secure key from random bytes
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[64]; // 512 bits
        random.nextBytes(keyBytes);
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userPrincipal.getId()))
                .claim("role", userPrincipal.getRole())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)  // Use the key instance
                .compact();
    }

    public String getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)  // Use the same key instance
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public String getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)  // Use the same key instance
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)  // Use the same key instance
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException e) {
            System.out.println("Invalid JWT signature: {}"+ e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: {}"+ e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("Expired JWT token: {}"+ e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("Unsupported JWT token: {}"+ e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: {}"+ e.getMessage());
        }
        return false;
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public ResponseCookie generateJwtCookie(String jwt) {
        return ResponseCookie.from("jwt", jwt)
                .path("/")
                .maxAge(24 * 60 * 60)
                .httpOnly(true)
                .secure(false)  // Set to true in production
                .sameSite("Lax")
                .build();
    }

    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from("jwt", "")
                .path("/")
                .maxAge(0)
                .build();
    }
}