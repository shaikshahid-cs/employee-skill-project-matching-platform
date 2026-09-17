package com.employeematching.controller;

import com.employeematching.dto.request.ProjectSkillRequest;
import com.employeematching.dto.response.ProjectSkillResponse;
import com.employeematching.service.ProjectSkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers/project-skills")
public class ProjectSkillController {

    private final ProjectSkillService projectSkillService;

    public ProjectSkillController(ProjectSkillService projectSkillService) {
        this.projectSkillService = projectSkillService;
    }

    @PostMapping
    public ResponseEntity<ProjectSkillResponse> addRequiredSkill(
            @Valid @RequestBody ProjectSkillRequest request,
            Authentication authentication) {

        ProjectSkillResponse response =
                projectSkillService.addRequiredSkill(
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectSkillResponse>> getProjectSkills(
            @PathVariable Long projectId,
            Authentication authentication) {

        return ResponseEntity.ok(
                projectSkillService.getProjectSkills(
                        projectId,
                        authentication
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectSkillResponse> updateRequiredSkill(
            @PathVariable Long id,
            @Valid @RequestBody ProjectSkillRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                projectSkillService.updateRequiredSkill(
                        id,
                        request,
                        authentication
                )
        );
    }
}