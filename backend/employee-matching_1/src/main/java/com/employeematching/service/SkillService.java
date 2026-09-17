package com.employeematching.service;

import com.employeematching.dto.response.SkillResponse;
import com.employeematching.entity.Skill;
import com.employeematching.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<SkillResponse> getAllSkills() {

        return skillRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SkillResponse> searchSkills(String name) {

        if (name == null || name.isBlank()) {
            return getAllSkills();
        }

        return skillRepository
                .findByNameContainingIgnoreCase(name.trim())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SkillResponse mapToResponse(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName()
        );
    }
}