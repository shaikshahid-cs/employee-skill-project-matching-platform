package com.employeematching.service;

import com.employeematching.dto.response.ProjectAssignmentResponse;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectAssignmentService {

    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;

    public ProjectAssignmentService(
            ProjectAssignmentRepository projectAssignmentRepository,
            ProjectRepository projectRepository,
            EmployeeRepository employeeRepository,
            ManagerRepository managerRepository,
            UserRepository userRepository) {
        this.projectAssignmentRepository = projectAssignmentRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProjectAssignmentResponse assignEmployee(
            Long projectId,
            Long employeeId,
            String assignedRole,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to assign employees to this project");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (projectAssignmentRepository.existsByProjectIdAndEmployeeId(projectId, employeeId)) {
            throw new RuntimeException("Employee is already assigned to this project");
        }

        ProjectAssignment assignment = new ProjectAssignment();
        assignment.setProject(project);
        assignment.setEmployee(employee);
        assignment.setAssignedByManager(project.getManager());
        assignment.setAssignedRole(assignedRole != null && !assignedRole.isBlank() ? assignedRole.trim() : project.getRequiredRole());
        assignment.setAssignmentDate(LocalDateTime.now());
        assignment.setStatus("ACTIVE");

        ProjectAssignment saved = projectAssignmentRepository.save(assignment);
        return mapToResponse(saved);
    }

    @Transactional
    public void unassignEmployee(
            Long projectId,
            Long employeeId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to unassign employees from this project");
        }

        ProjectAssignment assignment = projectAssignmentRepository
                .findByProjectIdAndEmployeeId(projectId, employeeId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        projectAssignmentRepository.delete(assignment);
    }

    public List<ProjectAssignmentResponse> getProjectAssignments(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view assignments for this project");
        }

        return projectAssignmentRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProjectAssignmentResponse> getMyAssignments(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        return projectAssignmentRepository.findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private ProjectAssignmentResponse mapToResponse(ProjectAssignment a) {
        Project p = a.getProject();
        Employee e = a.getEmployee();
        User u = e.getUser();
        User mUser = p.getManager().getUser();

        return new ProjectAssignmentResponse(
                a.getId(),
                p.getId(),
                p.getTitle(),
                p.getStatus(),
                mUser.getFullName(),
                e.getId(),
                u.getFullName(),
                u.getEmail(),
                e.getDesignation(),
                a.getAssignedRole(),
                a.getAssignmentDate() != null ? a.getAssignmentDate().toString() : "",
                a.getStatus()
        );
    }
}
