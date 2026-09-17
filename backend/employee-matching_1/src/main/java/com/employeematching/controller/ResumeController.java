package com.employeematching.controller;

import com.employeematching.dto.response.ResumeProcessingResponse;
import com.employeematching.dto.response.ResumeResponse;
import com.employeematching.service.ResumeProcessingService;
import com.employeematching.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/employees/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final ResumeProcessingService resumeProcessingService;

    public ResumeController(
            ResumeService resumeService,
            ResumeProcessingService resumeProcessingService) {

        this.resumeService = resumeService;
        this.resumeProcessingService = resumeProcessingService;
    }

    // =========================
    // UPLOAD RESUME
    // =========================

    @PostMapping
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication)
            throws IOException {

        ResumeResponse response =
                resumeService.uploadResume(
                        file,
                        authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================
    // GET MY RESUMES
    // =========================

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getMyResumes(
            Authentication authentication) {

        return ResponseEntity.ok(
                resumeService.getMyResumes(
                        authentication)
        );
    }

    // =========================
    // PROCESS RESUME
    // =========================

    @PostMapping("/{resumeId}/process")
    public ResponseEntity<ResumeProcessingResponse> processResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        ResumeProcessingResponse response =
                resumeProcessingService.processResume(resumeId, authentication);

        return ResponseEntity.ok(response);
    }
}