package com.employeematching.controller;

import com.employeematching.dto.response.SkillResponse;
import com.employeematching.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getSkills(
            @RequestParam(required = false) String name) {

        return ResponseEntity.ok(
                skillService.searchSkills(name)
        );
    }
}