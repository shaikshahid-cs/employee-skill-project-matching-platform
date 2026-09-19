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
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        validateProjectOwnership(project, user);

        Skill skill = skillRepository.findByNameIgnoreCase(request.getSkillName().trim())
                .orElseGet(() -> skillRepository.save(new Skill(request.getSkillName().trim(), "General")));

        ProjectSkill ps = projectSkillRepository.findByProjectIdAndSkillId(project.getId(), skill.getId())
                .orElse(new ProjectSkill());

        ps.setProject(project);
        ps.setSkill(skill);
        ps.setMinProficiency(Math.max(1, Math.min(5, request.getRequiredProficiency())));
        ps.setImportance(Math.max(1, Math.min(5, request.getImportance())));
        ps.setMandatory(request.isMandatory());

        ProjectSkill saved = projectSkillRepository.save(ps);
        return mapToResponse(saved);
    }

    public List<ProjectSkillResponse> getProjectSkills(Long projectId, Authentication authentication) {
        return projectSkillRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProjectSkillResponse updateRequiredSkill(
            Long id,
            ProjectSkillRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        ProjectSkill ps = projectSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project skill requirement not found"));

        validateProjectOwnership(ps.getProject(), user);

        ps.setMinProficiency(Math.max(1, Math.min(5, request.getRequiredProficiency())));
        ps.setImportance(Math.max(1, Math.min(5, request.getImportance())));
        ps.setMandatory(request.isMandatory());

        ProjectSkill updated = projectSkillRepository.save(ps);
        return mapToResponse(updated);
    }

    public void removeRequiredSkill(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        ProjectSkill ps = projectSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project skill requirement not found"));

        validateProjectOwnership(ps.getProject(), user);
        projectSkillRepository.delete(ps);
    }

    private void validateProjectOwnership(Project project, User user) {
        boolean isManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to modify this project");
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private ProjectSkillResponse mapToResponse(ProjectSkill ps) {
        return new ProjectSkillResponse(
                ps.getId(),
                ps.getProject().getId(),
                ps.getSkill().getId(),
                ps.getSkill().getName(),
                ps.getMinProficiency(),
                ps.getImportance(),
                ps.isMandatory()
        );
    }
}