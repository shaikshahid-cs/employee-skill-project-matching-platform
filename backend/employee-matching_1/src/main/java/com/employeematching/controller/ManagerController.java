package com.employeematching.controller;

import com.employeematching.dto.request.ManagerProfileRequest;
import com.employeematching.dto.response.ManagerProfileResponse;
import com.employeematching.service.ManagerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/manager/profile", "/api/managers/profile"})
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping
    public ResponseEntity<ManagerProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(managerService.getMyProfile(authentication));
    }

    @PutMapping
    public ResponseEntity<ManagerProfileResponse> updateProfile(
            @Valid @RequestBody ManagerProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(managerService.updateProfile(request, authentication));
    }

    @PostMapping
    public ResponseEntity<ManagerProfileResponse> createOrUpdateProfile(
            @Valid @RequestBody ManagerProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(managerService.updateProfile(request, authentication));
    }
}