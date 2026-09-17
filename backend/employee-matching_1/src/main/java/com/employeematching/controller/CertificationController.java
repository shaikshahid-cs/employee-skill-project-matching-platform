package com.employeematching.controller;

import com.employeematching.dto.request.CertificationRequest;
import com.employeematching.dto.response.CertificationResponse;
import com.employeematching.service.CertificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(
            CertificationService certificationService) {

        this.certificationService = certificationService;
    }

    @PostMapping
    public ResponseEntity<CertificationResponse> addCertification(
            @Valid @RequestBody CertificationRequest request,
            Authentication authentication) {

        CertificationResponse response =
                certificationService.addCertification(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getMyCertifications(
            Authentication authentication) {

        return ResponseEntity.ok(
                certificationService.getMyCertifications(authentication)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificationResponse> getCertificationById(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                certificationService.getCertificationById(id, authentication)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificationResponse> updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody CertificationRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                certificationService.updateCertification(id, request, authentication)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(
            @PathVariable Long id,
            Authentication authentication) {

        certificationService.deleteCertification(id, authentication);

        return ResponseEntity.noContent().build();
    }
}