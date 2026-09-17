package com.employeematching.controller;
import com.employeematching.dto.request.EmployeeProfileRequest;
import com.employeematching.dto.response.EmployeeProfileResponse;
import com.employeematching.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/profile")
    public ResponseEntity<EmployeeProfileResponse> createProfile(
            @Valid @RequestBody EmployeeProfileRequest request,
            Authentication authentication) {

        EmployeeProfileResponse response =
                employeeService.createProfile(request, authentication);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileResponse> getMyProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeService.getMyProfile(authentication)
        );
    }
}