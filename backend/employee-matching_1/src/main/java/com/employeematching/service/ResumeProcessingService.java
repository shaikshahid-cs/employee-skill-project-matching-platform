package com.employeematching.service;

import com.employeematching.dto.response.ResumeProcessingResponse;
import com.employeematching.dto.response.SkillResponse;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeProcessingService {

    private final ResumeRepository resumeRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final UserRepository userRepository;
    private final DocumentTextExtractionService documentTextExtractionService;
    private final JobDescriptionSkillExtractionService jobDescriptionSkillExtractionService;

    public ResumeProcessingService(
            ResumeRepository resumeRepository,
            EmployeeSkillRepository employeeSkillRepository,
            UserRepository userRepository,
            DocumentTextExtractionService documentTextExtractionService,
            JobDescriptionSkillExtractionService jobDescriptionSkillExtractionService) {

        this.resumeRepository = resumeRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.userRepository = userRepository;
        this.documentTextExtractionService = documentTextExtractionService;
        this.jobDescriptionSkillExtractionService = jobDescriptionSkillExtractionService;
    }

    public ResumeProcessingResponse processResume(Long resumeId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        Employee employee = resume.getEmployee();

        boolean isOwner = employee.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not authorized to process this resume");
        }

        try {
            resume.setProcessingStatus("PROCESSING");
            resumeRepository.save(resume);

            String extractedText = documentTextExtractionService.extractText(resume.getFilePath());

            List<Skill> detectedSkills = jobDescriptionSkillExtractionService.extractSkills(extractedText);

            for (Skill skill : detectedSkills) {
                boolean exists = employeeSkillRepository
                        .existsByEmployeeIdAndSkillId(employee.getId(), skill.getId());

                if (!exists) {
                    EmployeeSkill employeeSkill = new EmployeeSkill();
                    employeeSkill.setEmployee(employee);
                    employeeSkill.setSkill(skill);
                    employeeSkill.setProficiency(3); // Default proficiency
                    employeeSkill.setYearsExperience(1.0); // Default years experience

                    employeeSkillRepository.save(employeeSkill);
                }
            }

            List<SkillResponse> skillResponses = detectedSkills.stream()
                    .map(skill -> new SkillResponse(skill.getId(), skill.getName()))
                    .toList();

            resume.setProcessingStatus("PROCESSED");
            resumeRepository.save(resume);

            return new ResumeProcessingResponse(
                    resume.getId(),
                    "PROCESSED",
                    skillResponses
            );

        } catch (RuntimeException e) {
            resume.setProcessingStatus("FAILED");
            resumeRepository.save(resume);
            throw e;
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
