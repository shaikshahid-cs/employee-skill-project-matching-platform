package com.employeematching.controller;

import com.employeematching.dto.response.JobDescriptionProcessingResponse;
import com.employeematching.dto.response.JobDescriptionResponse;
import com.employeematching.service.JobDescriptionProcessingService;
import com.employeematching.service.JobDescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/managers/projects")
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;
    private final JobDescriptionProcessingService
            jobDescriptionProcessingService;

    public JobDescriptionController(
            JobDescriptionService jobDescriptionService,
            JobDescriptionProcessingService
                    jobDescriptionProcessingService) {

        this.jobDescriptionService = jobDescriptionService;
        this.jobDescriptionProcessingService =
                jobDescriptionProcessingService;
    }

    @PostMapping("/{projectId}/job-description")
    public ResponseEntity<JobDescriptionResponse> uploadJobDescription(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws Exception {

        JobDescriptionResponse response =
                jobDescriptionService.uploadJobDescription(
                        projectId,
                        file,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{projectId}/job-description")
    public ResponseEntity<JobDescriptionResponse> getJobDescription(
            @PathVariable Long projectId,
            Authentication authentication) {

        return ResponseEntity.ok(
                jobDescriptionService.getJobDescription(
                        projectId,
                        authentication
                )
        );
    }

    @PostMapping("/{projectId}/job-description/process")
    public ResponseEntity<JobDescriptionProcessingResponse>
    processJobDescription(
            @PathVariable Long projectId,
            Authentication authentication) {

        JobDescriptionProcessingResponse response =
                jobDescriptionProcessingService
                        .processJobDescription(
                                projectId,
                                authentication
                        );

        return ResponseEntity.ok(response);
    }
}