package com.employeematching.controller;

import com.employeematching.dto.request.EmployeeProfileRequest;
import com.employeematching.dto.response.EmployeeProfileResponse;
import com.employeematching.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/employee", "/api/employees"})
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(employeeService.getMyProfile(authentication));
    }

    @PutMapping("/profile")
    public ResponseEntity<EmployeeProfileResponse> updateProfile(
            @Valid @RequestBody EmployeeProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(employeeService.updateProfile(request, authentication));
    }

    @PostMapping("/profile")
    public ResponseEntity<EmployeeProfileResponse> createOrUpdateProfile(
            @Valid @RequestBody EmployeeProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(employeeService.updateProfile(request, authentication));
    }
}