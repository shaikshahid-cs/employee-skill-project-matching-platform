package com.employeematching.controller;

import com.employeematching.dto.request.ExperienceRequest;
import com.employeematching.dto.response.ExperienceResponse;
import com.employeematching.service.ExperienceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/experience")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getMyExperiences(Authentication authentication) {
        return ResponseEntity.ok(experienceService.getMyExperiences(authentication));
    }

    @PostMapping
    public ResponseEntity<ExperienceResponse> addExperience(
            @Valid @RequestBody ExperienceRequest request,
            Authentication authentication) {
        ExperienceResponse response = experienceService.addExperience(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceResponse> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(experienceService.updateExperience(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteExperience(
            @PathVariable Long id,
            Authentication authentication) {
        experienceService.deleteExperience(id, authentication);
        return ResponseEntity.ok(Map.of("message", "Experience deleted successfully"));
    }
}
