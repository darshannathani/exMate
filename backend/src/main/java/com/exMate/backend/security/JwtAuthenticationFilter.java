package com.exMate.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = tokenProvider.getJwtFromCookies(request);
            System.out.println("JWT from cookies: " + (jwt != null ? "present" : "null"));

            if (jwt != null) {
                System.out.println("JWT validation result: " + tokenProvider.validateToken(jwt));
            }

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                System.out.println("JWT validation successful");  // Debug line
                String userId = tokenProvider.getUserIdFromJWT(jwt);
                String role = tokenProvider.getRole(jwt);
                System.out.println("Role from token: " + role);  // Debug line
                System.out.println("User ID from token: " + userId);  // Debug line

                UserDetails userDetails = customUserDetailsService.loadUserById(Integer.parseInt(userId), role);
                System.out.println("User Authorities: " + userDetails.getAuthorities());  // Debug line

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                System.out.println("JWT validation failed because: " +
                        (!StringUtils.hasText(jwt) ? "JWT is empty or null" : "Token validation failed"));
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            ex.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}