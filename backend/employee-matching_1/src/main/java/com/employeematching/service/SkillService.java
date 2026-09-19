package com.employeematching.service;

import com.employeematching.dto.response.SkillResponse;
import com.employeematching.entity.Skill;
import com.employeematching.entity.SkillAlias;
import com.employeematching.repository.SkillAliasRepository;
import com.employeematching.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillAliasRepository skillAliasRepository;

    public SkillService(SkillRepository skillRepository, SkillAliasRepository skillAliasRepository) {
        this.skillRepository = skillRepository;
        this.skillAliasRepository = skillAliasRepository;
    }

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SkillResponse> searchSkills(String query) {
        if (query == null || query.isBlank()) {
            return getAllSkills();
        }

        String cleanQuery = query.trim();
        Map<Long, Skill> results = new LinkedHashMap<>();

        // 1. Direct name match
        skillRepository.findByNameContainingIgnoreCase(cleanQuery)
                .forEach(s -> results.put(s.getId(), s));

        // 2. Alias match
        List<SkillAlias> aliases = skillAliasRepository.findByAliasContainingIgnoreCase(cleanQuery);
        for (SkillAlias alias : aliases) {
            Skill skill = alias.getSkill();
            if (skill != null && !results.containsKey(skill.getId())) {
                results.put(skill.getId(), skill);
            }
        }

        return results.values().stream().map(this::mapToResponse).toList();
    }

    public SkillResponse createSkill(String name, String category) {
        if (name == null || name.isBlank()) {
            throw new RuntimeException("Skill name is required");
        }

        String trimmed = name.trim();
        Optional<Skill> existing = skillRepository.findByNameIgnoreCase(trimmed);
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        Skill skill = new Skill(trimmed, category != null && !category.isBlank() ? category.trim() : "General");
        Skill saved = skillRepository.save(skill);
        return mapToResponse(saved);
    }

    private SkillResponse mapToResponse(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getCategory()
        );
    }
}