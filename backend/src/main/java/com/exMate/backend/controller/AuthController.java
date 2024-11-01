package com.exMate.backend.controller;

import com.exMate.backend.model.Examiner;
import com.exMate.backend.payload.LoginRequest;
import com.exMate.backend.repository.ExaminerRepository;
import com.exMate.backend.security.JwtTokenProvider;
import com.exMate.backend.service.ExaminerService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ExaminerRepository examinerRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ExaminerService examinerService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register/examiner")
    public ResponseEntity<?> registerExaminer(@RequestBody Examiner examiner) {
        try{
            examinerService.addExaminer(examiner);
            return new ResponseEntity<>(examiner, HttpStatus.CREATED);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            System.out.println("Login - Generated JWT token length: " + jwt.length());

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwt)
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .domain(null)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body("Login successful");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid email or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = tokenProvider.getCleanJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("You've been signed out!");
    }
}