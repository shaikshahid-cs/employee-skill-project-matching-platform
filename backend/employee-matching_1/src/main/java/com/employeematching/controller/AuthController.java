package com.employeematching.controller;

import com.employeematching.dto.request.ChangePasswordRequest;
import com.employeematching.dto.request.LoginRequest;
import com.employeematching.dto.response.LoginResponse;
import com.employeematching.dto.response.UserResponse;
import com.employeematching.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        authService.changePassword(request, authentication);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}