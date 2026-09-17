package com.employeematching.controller;

import com.employeematching.dto.response.MatchResultResponse;
import com.employeematching.dto.response.ProjectResponse;
import com.employeematching.service.MatchResultService;
import com.employeematching.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectDiscoveryController {

    private final ProjectService projectService;
    private final MatchResultService matchResultService;

    public ProjectDiscoveryController(
            ProjectService projectService,
            MatchResultService matchResultService) {

        this.projectService = projectService;
        this.matchResultService = matchResultService;
    }

    @GetMapping("/open")
    public ResponseEntity<List<ProjectResponse>> getOpenProjects() {
        return ResponseEntity.ok(projectService.getOpenProjects());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<MatchResultResponse>> getRecommendedProjects(
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.getRecommendedProjectsForEmployee(authentication)
        );
    }
}
