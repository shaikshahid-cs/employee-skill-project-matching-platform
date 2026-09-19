package com.employeematching.controller;

import com.employeematching.dto.request.EmployeeSkillRequest;
import com.employeematching.dto.response.EmployeeSkillResponse;
import com.employeematching.service.EmployeeSkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/employee/skills", "/api/employees/skills"})
public class EmployeeSkillController {

    private final EmployeeSkillService employeeSkillService;

    public EmployeeSkillController(EmployeeSkillService employeeSkillService) {
        this.employeeSkillService = employeeSkillService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeSkillResponse>> getMySkills(Authentication authentication) {
        return ResponseEntity.ok(employeeSkillService.getMySkills(authentication));
    }

    @PostMapping
    public ResponseEntity<EmployeeSkillResponse> addSkill(
            @Valid @RequestBody EmployeeSkillRequest request,
            Authentication authentication) {
        EmployeeSkillResponse response = employeeSkillService.addSkill(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeSkillResponse> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeSkillRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(employeeSkillService.updateSkill(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSkill(
            @PathVariable Long id,
            Authentication authentication) {
        employeeSkillService.deleteSkill(id, authentication);
        return ResponseEntity.ok(Map.of("message", "Skill removed successfully"));
    }
}