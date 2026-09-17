package com.employeematching.service;

import com.employeematching.dto.request.ProjectSkillRequest;
import com.employeematching.dto.response.ProjectSkillResponse;
import com.employeematching.entity.Manager;
import com.employeematching.entity.Project;
import com.employeematching.entity.ProjectSkill;
import com.employeematching.entity.Skill;
import com.employeematching.entity.User;
import com.employeematching.repository.ManagerRepository;
import com.employeematching.repository.ProjectRepository;
import com.employeematching.repository.ProjectSkillRepository;
import com.employeematching.repository.SkillRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectSkillService {

    private final ProjectSkillRepository projectSkillRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;

    public ProjectSkillService(
            ProjectSkillRepository projectSkillRepository,
            ProjectRepository projectRepository,
            SkillRepository skillRepository,
            ManagerRepository managerRepository,
            UserRepository userRepository) {

        this.projectSkillRepository = projectSkillRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
    }

    public ProjectSkillResponse addRequiredSkill(
            ProjectSkillRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Manager profile not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (!project.getManager().getId().equals(manager.getId())) {
            throw new RuntimeException(
                    "You are not authorized to modify this project");
        }

        Skill skill = skillRepository
                .findByNameIgnoreCase(request.getSkillName().trim())
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(request.getSkillName().trim());
                    return skillRepository.save(newSkill);
                });

        if (projectSkillRepository
                .findByProjectIdAndSkillId(
                        project.getId(),
                        skill.getId())
                .isPresent()) {

            throw new RuntimeException(
                    "This skill is already required for the project");
        }

        ProjectSkill projectSkill = new ProjectSkill();

        projectSkill.setProject(project);
        projectSkill.setSkill(skill);
        projectSkill.setRequiredProficiency(
                request.getRequiredProficiency());
        projectSkill.setImportance(
                request.getImportance());

        ProjectSkill saved =
                projectSkillRepository.save(projectSkill);

        return mapToResponse(saved);
    }

    public List<ProjectSkillResponse> getProjectSkills(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Manager profile not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (!project.getManager().getId().equals(manager.getId())) {
            throw new RuntimeException(
                    "You are not authorized to view this project");
        }

        return projectSkillRepository
                .findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProjectSkillResponse updateRequiredSkill(
            Long projectSkillId,
            ProjectSkillRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        ProjectSkill projectSkill = projectSkillRepository.findById(projectSkillId)
                .orElseThrow(() -> new RuntimeException("Project skill requirement not found"));

        if (!projectSkill.getProject().getManager().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to modify this project skill");
        }

        projectSkill.setRequiredProficiency(request.getRequiredProficiency());
        projectSkill.setImportance(request.getImportance());

        ProjectSkill saved = projectSkillRepository.save(projectSkill);

        return mapToResponse(saved);
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));
    }

    private ProjectSkillResponse mapToResponse(
            ProjectSkill projectSkill) {

        Skill skill = projectSkill.getSkill();

        return new ProjectSkillResponse(
                projectSkill.getId(),
                projectSkill.getProject().getId(),
                skill.getId(),
                skill.getName(),
                projectSkill.getRequiredProficiency(),
                projectSkill.getImportance()
        );
    }
}