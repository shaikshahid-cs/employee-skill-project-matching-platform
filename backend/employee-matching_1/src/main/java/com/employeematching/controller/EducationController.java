package com.employeematching.controller;

import com.employeematching.dto.request.EducationRequest;
import com.employeematching.dto.response.EducationResponse;
import com.employeematching.service.EducationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees/education")
public class EducationController {

    private final EducationService educationService;

    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    // =========================
    // ADD EDUCATION
    // =========================

    @PostMapping
    public ResponseEntity<EducationResponse> addEducation(
            @Valid @RequestBody EducationRequest request,
            Authentication authentication) {

        EducationResponse response =
                educationService.addEducation(
                        request,
                        authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================
    // GET MY EDUCATION
    // =========================

    @GetMapping
    public ResponseEntity<List<EducationResponse>> getMyEducation(
            Authentication authentication) {

        return ResponseEntity.ok(
                educationService.getMyEducation(
                        authentication)
        );
    }

    // =========================
    // GET EDUCATION BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<EducationResponse> getEducationById(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                educationService.getEducationById(
                        id,
                        authentication)
        );
    }

    // =========================
    // UPDATE EDUCATION
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<EducationResponse> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                educationService.updateEducation(
                        id,
                        request,
                        authentication)
        );
    }

    // =========================
    // DELETE EDUCATION
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable Long id,
            Authentication authentication) {

        educationService.deleteEducation(
                id,
                authentication);

        return ResponseEntity.noContent().build();
    }
}