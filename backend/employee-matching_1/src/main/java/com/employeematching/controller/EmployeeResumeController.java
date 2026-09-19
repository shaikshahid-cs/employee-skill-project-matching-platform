package com.employeematching.controller;

import com.employeematching.dto.response.ResumeExtractionPreviewDTO;
import com.employeematching.service.AssistiveDocumentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/employee/resume")
public class EmployeeResumeController {

    private final AssistiveDocumentService assistiveDocumentService;

    public EmployeeResumeController(AssistiveDocumentService assistiveDocumentService) {
        this.assistiveDocumentService = assistiveDocumentService;
    }

    @PostMapping(value = "/extract", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeExtractionPreviewDTO> extractResume(
            @RequestParam("file") MultipartFile file) {
        ResumeExtractionPreviewDTO preview = assistiveDocumentService.parseResume(file);
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, String>> applyResume(
            @RequestBody ResumeExtractionPreviewDTO verifiedData,
            Authentication authentication) {
        assistiveDocumentService.applyVerifiedResume(verifiedData, authentication);
        return ResponseEntity.ok(Map.of("message", "Resume profile information successfully applied to profile."));
    }
}
