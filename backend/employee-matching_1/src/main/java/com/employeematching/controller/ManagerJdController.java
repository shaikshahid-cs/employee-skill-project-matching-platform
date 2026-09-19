package com.employeematching.controller;

import com.employeematching.dto.response.JdExtractionPreviewDTO;
import com.employeematching.service.AssistiveDocumentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/manager/jd")
public class ManagerJdController {

    private final AssistiveDocumentService assistiveDocumentService;

    public ManagerJdController(AssistiveDocumentService assistiveDocumentService) {
        this.assistiveDocumentService = assistiveDocumentService;
    }

    @PostMapping(value = "/extract", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JdExtractionPreviewDTO> extractJobDescription(
            @RequestParam("file") MultipartFile file) {
        JdExtractionPreviewDTO preview = assistiveDocumentService.parseJd(file);
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/projects/{projectId}/apply")
    public ResponseEntity<Map<String, String>> applyJobDescription(
            @PathVariable Long projectId,
            @RequestBody JdExtractionPreviewDTO verifiedData,
            Authentication authentication) {
        assistiveDocumentService.applyVerifiedJdToProject(projectId, verifiedData, authentication);
        return ResponseEntity.ok(Map.of("message", "Job description requirements successfully applied to project."));
    }
}
