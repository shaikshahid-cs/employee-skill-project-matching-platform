package com.employeematching.controller;

import com.employeematching.dto.request.CreateUserRequest;
import com.employeematching.dto.response.CreateUserResponse;
import com.employeematching.dto.response.UserResponse;
import com.employeematching.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PostMapping("/employees")
    public ResponseEntity<CreateUserResponse> createEmployee(
            @Valid @RequestBody CreateUserRequest request) {
        CreateUserResponse response = adminService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/managers")
    public ResponseEntity<CreateUserResponse> createManager(
            @Valid @RequestBody CreateUserRequest request) {
        CreateUserResponse response = adminService.createManager(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean active,
            Authentication authentication) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id, active, authentication));
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        String newPassword = (body != null) ? body.get("newPassword") : null;
        return ResponseEntity.ok(adminService.resetUserPassword(id, newPassword, authentication));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {
        adminService.deleteUser(id, authentication);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping({"/overview", "/stats"})
    public ResponseEntity<Map<String, Object>> getOverviewStats() {
        return ResponseEntity.ok(adminService.getOverviewStats());
    }
}
