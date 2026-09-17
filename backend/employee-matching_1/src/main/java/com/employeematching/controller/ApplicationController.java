package com.employeematching.controller;

import com.employeematching.dto.request.ApplicationRequest;
import com.employeematching.dto.response.ApplicationResponse;
import com.employeematching.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.employeematching.dto.request.ApplicationReviewRequest;
import com.employeematching.dto.response.ApplicationReviewResponse;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> applyToProject(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {

        ApplicationResponse response =
                applicationService.applyToProject(
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getMyApplications(
                        authentication
                )
        );
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ApplicationResponse>> getProjectApplications(
            @PathVariable Long projectId,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getProjectApplications(
                        projectId,
                        authentication
                )
        );
    }

    @PutMapping("/{applicationId}/review")
    public ResponseEntity<ApplicationReviewResponse> reviewApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationReviewRequest request,
            Authentication authentication) {

        ApplicationReviewResponse response =
                applicationService.reviewApplication(
                        applicationId,
                        request,
                        authentication
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/select-candidate")
    public ResponseEntity<ApplicationResponse> selectCandidate(
            @RequestParam Long projectId,
            @RequestParam Long employeeId,
            @RequestParam(defaultValue = "SHORTLISTED") String status,
            Authentication authentication) {

        ApplicationResponse response =
                applicationService.managerSelectCandidate(
                        projectId,
                        employeeId,
                        status,
                        authentication
                );

        return ResponseEntity.ok(response);
    }
}