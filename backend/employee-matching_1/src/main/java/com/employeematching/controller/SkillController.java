package com.employeematching.controller;

import com.employeematching.dto.response.SkillResponse;
import com.employeematching.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SkillResponse>> searchSkills(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "") String q) {
        String searchTerm = !query.isBlank() ? query : q;
        return ResponseEntity.ok(skillService.searchSkills(searchTerm));
    }

    @PostMapping
    public ResponseEntity<SkillResponse> createSkill(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String category = payload.get("category");
        SkillResponse response = skillService.createSkill(name, category);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}