package com.employeematching.service;

import com.employeematching.dto.response.JobDescriptionProcessingResponse;
import com.employeematching.dto.response.SkillResponse;
import com.employeematching.entity.JobDescription;
import com.employeematching.entity.Project;
import com.employeematching.entity.ProjectSkill;
import com.employeematching.entity.Skill;
import com.employeematching.entity.User;
import com.employeematching.repository.JobDescriptionRepository;
import com.employeematching.repository.ProjectRepository;
import com.employeematching.repository.ProjectSkillRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobDescriptionProcessingService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final ProjectRepository projectRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final UserRepository userRepository;
    private final DocumentTextExtractionService documentTextExtractionService;
    private final JobDescriptionSkillExtractionService
            jobDescriptionSkillExtractionService;

    public JobDescriptionProcessingService(
            JobDescriptionRepository jobDescriptionRepository,
            ProjectRepository projectRepository,
            ProjectSkillRepository projectSkillRepository,
            UserRepository userRepository,
            DocumentTextExtractionService documentTextExtractionService,
            JobDescriptionSkillExtractionService
                    jobDescriptionSkillExtractionService) {

        this.jobDescriptionRepository = jobDescriptionRepository;
        this.projectRepository = projectRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.userRepository = userRepository;
        this.documentTextExtractionService =
                documentTextExtractionService;
        this.jobDescriptionSkillExtractionService =
                jobDescriptionSkillExtractionService;
    }

    public JobDescriptionProcessingResponse processJobDescription(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (!project.getManager().getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to process this project");
        }

        JobDescription jobDescription =
                jobDescriptionRepository.findByProjectId(projectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job description not found"));

        try {

            // Step 1: Mark as PROCESSING
            jobDescription.setProcessingStatus("PROCESSING");
            jobDescriptionRepository.save(jobDescription);

            // Step 2: Extract text from uploaded document
            String extractedText =
                    documentTextExtractionService.extractText(
                            jobDescription.getFilePath());

            // Step 3: Detect skills from extracted text
            List<Skill> detectedSkills =
                    jobDescriptionSkillExtractionService
                            .extractSkills(extractedText);

            // Step 4: Save detected skills against the project
            for (Skill skill : detectedSkills) {

                boolean alreadyExists =
                        projectSkillRepository
                                .findByProjectIdAndSkillId(
                                        projectId,
                                        skill.getId())
                                .isPresent();

                if (!alreadyExists) {

                    ProjectSkill projectSkill =
                            new ProjectSkill();

                    projectSkill.setProject(project);
                    projectSkill.setSkill(skill);

                    /*
                     * Default values.
                     *
                     * These can later be changed to values
                     * extracted from the job description
                     * or provided by the manager.
                     */
                    projectSkill.setRequiredProficiency(1);
                    projectSkill.setImportance(1);

                    projectSkillRepository.save(projectSkill);
                }
            }

            // Step 5: Convert detected skills to response DTOs
            List<SkillResponse> skillResponses =
                    detectedSkills.stream()
                            .map(skill ->
                                    new SkillResponse(
                                            skill.getId(),
                                            skill.getName()))
                            .toList();

            // Step 6: Mark processing as completed
            jobDescription.setProcessingStatus("PROCESSED");
            jobDescriptionRepository.save(jobDescription);

            // Step 7: Return response
            return new JobDescriptionProcessingResponse(
                    projectId,
                    "PROCESSED",
                    skillResponses
            );

        } catch (RuntimeException e) {

            jobDescription.setProcessingStatus("FAILED");
            jobDescriptionRepository.save(jobDescription);

            throw e;
        }
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));
    }
}