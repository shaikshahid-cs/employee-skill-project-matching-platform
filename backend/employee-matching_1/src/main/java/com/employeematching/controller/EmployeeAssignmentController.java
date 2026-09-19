package com.employeematching.controller;

import com.employeematching.dto.response.ProjectAssignmentResponse;
import com.employeematching.service.ProjectAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/employee/assignments", "/api/employees/assignments"})
public class EmployeeAssignmentController {

    private final ProjectAssignmentService projectAssignmentService;

    public EmployeeAssignmentController(ProjectAssignmentService projectAssignmentService) {
        this.projectAssignmentService = projectAssignmentService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectAssignmentResponse>> getMyAssignments(Authentication authentication) {
        return ResponseEntity.ok(projectAssignmentService.getMyAssignments(authentication));
    }
}
