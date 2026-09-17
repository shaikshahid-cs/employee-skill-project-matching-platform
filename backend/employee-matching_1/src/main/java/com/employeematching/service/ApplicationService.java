package com.employeematching.service;

import com.employeematching.dto.request.ApplicationRequest;
import com.employeematching.dto.request.ApplicationReviewRequest;
import com.employeematching.dto.response.ApplicationResponse;
import com.employeematching.dto.response.ApplicationReviewResponse;
import com.employeematching.entity.Application;
import com.employeematching.entity.Employee;
import com.employeematching.entity.Manager;
import com.employeematching.entity.Project;
import com.employeematching.entity.User;
import com.employeematching.repository.ApplicationRepository;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.ManagerRepository;
import com.employeematching.repository.ProjectRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.employeematching.repository.EmployeeSkillRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

        private final ApplicationRepository applicationRepository;
        private final EmployeeRepository employeeRepository;
        private final ProjectRepository projectRepository;
        private final ManagerRepository managerRepository;
        private final UserRepository userRepository;
        private final EmployeeSkillRepository employeeSkillRepository;

        public ApplicationService(
                        ApplicationRepository applicationRepository,
                        EmployeeRepository employeeRepository,
                        ProjectRepository projectRepository,
                        ManagerRepository managerRepository,
                        UserRepository userRepository,
                        EmployeeSkillRepository employeeSkillRepository) {

                this.applicationRepository = applicationRepository;
                this.employeeRepository = employeeRepository;
                this.projectRepository = projectRepository;
                this.managerRepository = managerRepository;
                this.userRepository = userRepository;
                this.employeeSkillRepository = employeeSkillRepository;
        }

        // =========================
        // EMPLOYEE: APPLY TO PROJECT
        // =========================

        public ApplicationResponse applyToProject(
                        ApplicationRequest request,
                        Authentication authentication) {

                User user = getAuthenticatedUser(authentication);

                Employee employee = employeeRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

                Project project = projectRepository.findById(request.getProjectId())
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                if (!"OPEN".equalsIgnoreCase(project.getStatus())) {
                        throw new RuntimeException(
                                        "Applications are not open for this project");
                }

                if (applicationRepository
                                .findByEmployeeIdAndProjectId(
                                                employee.getId(),
                                                project.getId())
                                .isPresent()) {

                        throw new RuntimeException(
                                        "You have already applied to this project");
                }

                Application application = new Application();

                application.setEmployee(employee);
                application.setProject(project);
                application.setStatus("PENDING");

                String now = LocalDateTime.now().toString();

                application.setAppliedAt(now);
                application.setUpdatedAt(now);

                Application savedApplication = applicationRepository.save(application);

                return mapToResponse(savedApplication);
        }

        // =========================
        // EMPLOYEE: MY APPLICATIONS
        // =========================

        public List<ApplicationResponse> getMyApplications(
                        Authentication authentication) {

                User user = getAuthenticatedUser(authentication);

                Employee employee = employeeRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

                return applicationRepository
                                .findByEmployeeId(employee.getId())
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =========================
        // MANAGER: VIEW APPLICATIONS
        // =========================

        public List<ApplicationResponse> getProjectApplications(
                        Long projectId,
                        Authentication authentication) {

                User user = getAuthenticatedUser(authentication);

                Manager manager = managerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Manager profile not found"));

                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                if (!project.getManager().getId().equals(manager.getId())) {
                        throw new RuntimeException(
                                        "You are not authorized to view applications for this project");
                }

                return applicationRepository
                                .findByProjectId(projectId)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =========================
        // MANAGER: REVIEW APPLICATION
        // =========================

        public ApplicationReviewResponse reviewApplication(
                        Long applicationId,
                        ApplicationReviewRequest request,
                        Authentication authentication) {

                User user = getAuthenticatedUser(authentication);

                Manager manager = managerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Manager profile not found"));

                Application application = applicationRepository.findById(applicationId)
                                .orElseThrow(() -> new RuntimeException("Application not found"));

                Project project = application.getProject();

                if (!project.getManager().getId().equals(manager.getId())) {
                        throw new RuntimeException(
                                        "You are not authorized to review this application");
                }

                String status = request.getStatus().trim().toUpperCase();

                if (!status.equals("ACCEPTED") &&
                                !status.equals("REJECTED") &&
                                !status.equals("UNDER_REVIEW") &&
                                !status.equals("SHORTLISTED")) {

                        throw new RuntimeException(
                                        "Application status must be UNDER_REVIEW, SHORTLISTED, ACCEPTED, or REJECTED");
                }


                application.setStatus(status);
                application.setUpdatedAt(
                                LocalDateTime.now().toString());

                Application updatedApplication = applicationRepository.save(application);

                return new ApplicationReviewResponse(
                                updatedApplication.getId(),
                                updatedApplication.getProject().getId(),
                                updatedApplication.getEmployee().getId(),
                                updatedApplication.getStatus());
        }

        // =========================
        // MANAGER: DIRECT SELECT / SHORTLIST CANDIDATE
        // =========================

        public ApplicationResponse managerSelectCandidate(
                        Long projectId,
                        Long employeeId,
                        String status,
                        Authentication authentication) {

                User user = getAuthenticatedUser(authentication);

                Manager manager = managerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Manager profile not found"));

                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                if (!project.getManager().getId().equals(manager.getId())) {
                        throw new RuntimeException("You are not authorized to manage candidates for this project");
                }

                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                Application application = applicationRepository
                                .findByEmployeeIdAndProjectId(employee.getId(), project.getId())
                                .orElseGet(() -> {
                                        Application newApp = new Application();
                                        newApp.setEmployee(employee);
                                        newApp.setProject(project);
                                        newApp.setAppliedAt(LocalDateTime.now().toString());
                                        return newApp;
                                });

                String newStatus = (status != null && !status.isBlank()) ? status.trim().toUpperCase() : "SHORTLISTED";
                application.setStatus(newStatus);
                application.setUpdatedAt(LocalDateTime.now().toString());

                Application saved = applicationRepository.save(application);
                return mapToResponse(saved);
        }

        // =========================
        // COMMON METHODS
        // =========================

        private User getAuthenticatedUser(
                        Authentication authentication) {

                String email = authentication.getName();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "Authenticated user not found"));
        }

        private ApplicationResponse mapToResponse(
                        Application application) {

                Employee emp = application.getEmployee();
                User user = emp.getUser();

                List<String> skills = employeeSkillRepository.findByEmployeeId(emp.getId())
                                .stream()
                                .filter(es -> es.getSkill() != null && es.getSkill().getName() != null)
                                .map(es -> es.getSkill().getName())
                                .toList();

                return new ApplicationResponse(
                                application.getId(),
                                application.getProject().getId(),
                                application.getProject().getTitle(),
                                emp.getId(),
                                user.getName(),
                                user.getEmail(),
                                emp.getDesignation(),
                                emp.getDepartment(),
                                emp.getExperience(),
                                skills,
                                application.getStatus(),
                                application.getAppliedAt(),
                                application.getUpdatedAt());
        }
}