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

@RestController
@RequestMapping("/api/employees/skills")
public class EmployeeSkillController {

    private final EmployeeSkillService employeeSkillService;

    public EmployeeSkillController(EmployeeSkillService employeeSkillService) {
        this.employeeSkillService = employeeSkillService;
    }

    @PostMapping
    public ResponseEntity<EmployeeSkillResponse> addSkill(
            @Valid @RequestBody EmployeeSkillRequest request,
            Authentication authentication) {

        EmployeeSkillResponse response =
                employeeSkillService.addSkill(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeSkillResponse>> getMySkills(
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeSkillService.getMySkills(authentication)
        );
    }
}