package com.employeematching.service;

import com.employeematching.dto.request.ProjectRequest;
import com.employeematching.dto.response.ProjectResponse;
import com.employeematching.entity.Manager;
import com.employeematching.entity.Project;
import com.employeematching.entity.User;
import com.employeematching.repository.ManagerRepository;
import com.employeematching.repository.ProjectRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ManagerRepository managerRepository,
            UserRepository userRepository) {

        this.projectRepository = projectRepository;
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
    }

    public ProjectResponse createProject(
            ProjectRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Manager profile not found"));

        Project project = new Project();

        project.setManager(manager);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setDepartment(request.getDepartment());
        project.setLocation(request.getLocation());
        project.setExperienceRequired(request.getExperienceRequired());

        // New projects start in OPEN state
        project.setStatus("OPEN");

        Project savedProject = projectRepository.save(project);

        return mapToResponse(savedProject);
    }

    public List<ProjectResponse> getMyProjects(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Manager profile not found"));

        return projectRepository.findByManagerId(manager.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProjectResponse> getOpenProjects() {
        return projectRepository.findByStatus("OPEN")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));
    }

    private ProjectResponse mapToResponse(Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getManager().getId(),
                project.getTitle(),
                project.getDescription(),
                project.getDepartment(),
                project.getLocation(),
                project.getExperienceRequired(),
                project.getStatus()
        );
    }
}