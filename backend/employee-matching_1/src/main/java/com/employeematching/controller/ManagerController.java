package com.employeematching.controller;

import com.employeematching.dto.request.ManagerProfileRequest;
import com.employeematching.dto.response.ManagerProfileResponse;
import com.employeematching.service.ManagerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping("/profile")
    public ResponseEntity<ManagerProfileResponse> createProfile(
            @Valid @RequestBody ManagerProfileRequest request,
            Authentication authentication) {

        ManagerProfileResponse response =
                managerService.createProfile(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<ManagerProfileResponse> getMyProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                managerService.getMyProfile(authentication)
        );
    }
}