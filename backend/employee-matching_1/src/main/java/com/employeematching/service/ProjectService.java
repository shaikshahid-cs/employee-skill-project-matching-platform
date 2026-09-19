package com.employeematching.service;

import com.employeematching.dto.request.ProjectRequest;
import com.employeematching.dto.response.ProjectResponse;
import com.employeematching.dto.response.ProjectSkillResponse;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final SkillRepository skillRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ManagerRepository managerRepository,
            UserRepository userRepository,
            ProjectSkillRepository projectSkillRepository,
            ProjectAssignmentRepository projectAssignmentRepository,
            SkillRepository skillRepository) {
        this.projectRepository = projectRepository;
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.projectAssignmentRepository = projectAssignmentRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public ProjectResponse createProject(
            ProjectRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Manager m = new Manager();
                    m.setUser(user);
                    return managerRepository.save(m);
                });

        Project project = new Project();
        project.setManager(manager);
        applyRequestToProject(project, request);
        project.setStatus(request.getStatus() != null ? request.getStatus() : "OPEN");

        Project savedProject = projectRepository.save(project);

        // If skills were supplied in the create request, persist them
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            for (ProjectRequest.ProjectSkillItem item : request.getSkills()) {
                if (item.getSkillName() != null && !item.getSkillName().isBlank()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(item.getSkillName().trim())
                            .orElseGet(() -> skillRepository.save(new Skill(item.getSkillName().trim(), "General")));

                    ProjectSkill ps = new ProjectSkill(
                            savedProject,
                            skill,
                            Math.max(1, Math.min(5, item.getMinProficiency())),
                            Math.max(1, Math.min(5, item.getImportance())),
                            item.isMandatory()
                    );
                    projectSkillRepository.save(ps);
                }
            }
        }

        return mapToResponse(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(
            Long id,
            ProjectRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to update this project");
        }

        applyRequestToProject(project, request);
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        Project updated = projectRepository.save(project);

        // If skills list is provided in update, sync them
        if (request.getSkills() != null) {
            projectSkillRepository.deleteByProjectId(project.getId());
            for (ProjectRequest.ProjectSkillItem item : request.getSkills()) {
                if (item.getSkillName() != null && !item.getSkillName().isBlank()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(item.getSkillName().trim())
                            .orElseGet(() -> skillRepository.save(new Skill(item.getSkillName().trim(), "General")));

                    ProjectSkill ps = new ProjectSkill(
                            updated,
                            skill,
                            Math.max(1, Math.min(5, item.getMinProficiency())),
                            Math.max(1, Math.min(5, item.getImportance())),
                            item.isMandatory()
                    );
                    projectSkillRepository.save(ps);
                }
            }
        }

        return mapToResponse(updated);
    }

    public ProjectResponse getProjectById(Long id, Authentication authentication) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToResponse(project);
    }

    public List<ProjectResponse> getMyProjects(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Manager m = new Manager();
                    m.setUser(user);
                    return managerRepository.save(m);
                });

        return projectRepository.findByManagerId(manager.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteProject(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to delete this project");
        }

        projectSkillRepository.deleteByProjectId(id);
        projectAssignmentRepository.findByProjectId(id).forEach(projectAssignmentRepository::delete);
        projectRepository.delete(project);
    }

    public List<ProjectResponse> getOpenProjects() {
        return projectRepository.findByStatus("OPEN")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void applyRequestToProject(Project project, ProjectRequest request) {
        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setDepartment(request.getDepartment());
        project.setLocation(request.getLocation());
        if (request.getWorkMode() != null) {
            project.setWorkMode(request.getWorkMode());
        }
        project.setRequiredRole(request.getRequiredRole() != null ? request.getRequiredRole().trim() : "Software Engineer");
        project.setRoleMandatory(request.isRoleMandatory());
        project.setRequiredDomain(request.getRequiredDomain() != null ? request.getRequiredDomain().trim() : "General");
        project.setDomainMandatory(request.isDomainMandatory());
        project.setMinExperienceYears(request.getMinExperienceYears() != null ? request.getMinExperienceYears() : 0.0);
        project.setExperienceMandatory(request.isExperienceMandatory());
        project.setRequiredDegreeLevel(request.getRequiredDegreeLevel());
        project.setRequiredDegreeField(request.getRequiredDegreeField());
        project.setEducationMandatory(request.isEducationMandatory());
        project.setRequiredCertification(request.getRequiredCertification());
        project.setCertificationMandatory(request.isCertificationMandatory());
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private ProjectResponse mapToResponse(Project project) {
        int assignedCount = (int) projectAssignmentRepository.findByProjectId(project.getId()).size();

        List<ProjectSkillResponse> skills = projectSkillRepository.findByProjectId(project.getId())
                .stream()
                .map(ps -> new ProjectSkillResponse(
                        ps.getId(),
                        project.getId(),
                        ps.getSkill().getId(),
                        ps.getSkill().getName(),
                        ps.getMinProficiency(),
                        ps.getImportance(),
                        ps.isMandatory()
                ))
                .toList();

        return new ProjectResponse(
                project.getId(),
                project.getManager().getId(),
                project.getManager().getUser().getFullName(),
                project.getTitle(),
                project.getDescription(),
                project.getDepartment(),
                project.getLocation(),
                project.getWorkMode(),
                project.getRequiredRole(),
                project.isRoleMandatory(),
                project.getRequiredDomain(),
                project.isDomainMandatory(),
                project.getMinExperienceYears(),
                project.isExperienceMandatory(),
                project.getRequiredDegreeLevel(),
                project.getRequiredDegreeField(),
                project.isEducationMandatory(),
                project.getRequiredCertification(),
                project.isCertificationMandatory(),
                project.getStatus(),
                assignedCount,
                skills
        );
    }
}