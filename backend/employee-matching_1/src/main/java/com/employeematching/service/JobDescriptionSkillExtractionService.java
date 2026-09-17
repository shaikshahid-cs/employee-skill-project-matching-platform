package com.employeematching.service;

import com.employeematching.entity.Skill;
import com.employeematching.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class JobDescriptionSkillExtractionService {

    private final SkillRepository skillRepository;

    public JobDescriptionSkillExtractionService(
            SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> extractSkills(String extractedText) {

        if (extractedText == null || extractedText.isBlank()) {
            return List.of();
        }

        String normalizedText =
                extractedText.toLowerCase(Locale.ROOT);

        return skillRepository.findAll()
                .stream()
                .filter(skill -> {
                    if (skill.getName() == null || skill.getName().isBlank()) {
                        return false;
                    }
                    String skillNameLower = skill.getName().toLowerCase(Locale.ROOT);
                    Pattern pattern = Pattern.compile("\\b" + Pattern.quote(skillNameLower) + "\\b");
                    return pattern.matcher(normalizedText).find();
                })
                .toList();
    }
}