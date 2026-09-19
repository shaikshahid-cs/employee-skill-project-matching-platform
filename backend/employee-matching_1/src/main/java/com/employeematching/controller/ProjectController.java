package com.employeematching.controller;

import com.employeematching.dto.request.ProjectRequest;
import com.employeematching.dto.response.MatchExplanationResponse;
import com.employeematching.dto.response.MatchResultResponse;
import com.employeematching.dto.response.ProjectAssignmentResponse;
import com.employeematching.dto.response.ProjectResponse;
import com.employeematching.service.MatchResultService;
import com.employeematching.service.ProjectAssignmentService;
import com.employeematching.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/manager/projects", "/api/managers/projects"})
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectAssignmentService projectAssignmentService;
    private final MatchResultService matchResultService;

    public ProjectController(
            ProjectService projectService,
            ProjectAssignmentService projectAssignmentService,
            MatchResultService matchResultService) {
        this.projectService = projectService;
        this.projectAssignmentService = projectAssignmentService;
        this.matchResultService = matchResultService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        ProjectResponse response = projectService.createProject(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication authentication) {
        return ResponseEntity.ok(projectService.getMyProjects(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(projectService.getProjectById(id, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(projectService.updateProject(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {
        projectService.deleteProject(id, authentication);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }

    // ==========================================
    // PROJECT TEAM ASSIGNMENTS
    // ==========================================

    @PostMapping("/{id}/assignments")
    public ResponseEntity<ProjectAssignmentResponse> assignEmployee(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        Long employeeId = Long.valueOf(payload.get("employeeId").toString());
        String role = payload.get("role") != null 
                ? (String) payload.get("role") 
                : (String) payload.get("projectRole");
        ProjectAssignmentResponse response = projectAssignmentService.assignEmployee(id, employeeId, role, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}/assignments/{employeeId}")
    public ResponseEntity<Map<String, String>> unassignEmployee(
            @PathVariable Long id,
            @PathVariable Long employeeId,
            Authentication authentication) {
        projectAssignmentService.unassignEmployee(id, employeeId, authentication);
        return ResponseEntity.ok(Map.of("message", "Employee unassigned successfully"));
    }

    @GetMapping("/{id}/assignments")
    public ResponseEntity<List<ProjectAssignmentResponse>> getProjectAssignments(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(projectAssignmentService.getProjectAssignments(id, authentication));
    }

    // ==========================================
    // CANDIDATE SEARCH & MATCHING
    // ==========================================

    @GetMapping("/{id}/candidates")
    public ResponseEntity<List<MatchResultResponse>> getCandidatesForProject(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(matchResultService.calculateAllMatchesForProject(id, authentication));
    }

    @GetMapping("/{id}/candidates/{employeeId}/explanation")
    public ResponseEntity<MatchExplanationResponse> getCandidateExplanation(
            @PathVariable Long id,
            @PathVariable Long employeeId,
            Authentication authentication) {
        return ResponseEntity.ok(matchResultService.getCandidateExplanation(id, employeeId, authentication));
    }
}