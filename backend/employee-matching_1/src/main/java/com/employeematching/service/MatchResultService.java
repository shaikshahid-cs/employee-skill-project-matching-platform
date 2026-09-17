package com.employeematching.service;

import com.employeematching.dto.response.MatchExplanationResponse;
import com.employeematching.dto.request.MatchCalculationRequest;
import com.employeematching.dto.response.MatchResultResponse;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchResultService {

    private final MatchResultRepository matchResultRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;

    public MatchResultService(
            MatchResultRepository matchResultRepository,
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            EmployeeSkillRepository employeeSkillRepository,
            ProjectSkillRepository projectSkillRepository,
            CertificationRepository certificationRepository,
            UserRepository userRepository) {

        this.matchResultRepository = matchResultRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.certificationRepository = certificationRepository;
        this.userRepository = userRepository;
    }

    public MatchResultResponse calculateAndSaveMatch(
            MatchCalculationRequest request,
            Authentication authentication) {

        User authenticatedUser = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Authorization check: User must be either the employee being matched or the
        // project's manager or an admin
        boolean isOwnerEmployee = employee.getUser().getId().equals(authenticatedUser.getId());
        boolean isProjectManager = project.getManager().getUser().getId().equals(authenticatedUser.getId());
        boolean isAdmin = authenticatedUser.getRole() == User.Role.ADMIN;

        if (!isOwnerEmployee && !isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to calculate match for this employee and project");
        }

        return performMatchCalculation(employee, project);
    }

    public List<MatchResultResponse> calculateAllMatchesForProject(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isProjectManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to calculate matches for this project");
        }

        List<Employee> allEmployees = employeeRepository.findAll();

        return allEmployees.stream()
                .map(employee -> performMatchCalculation(employee, project))
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public List<MatchResultResponse> getMyMatchResults(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        return matchResultRepository.findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public List<MatchResultResponse> getRecommendedProjectsForEmployee(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        List<Project> openProjects = projectRepository.findByStatus("OPEN");

        return openProjects.stream()
                .map(project -> performMatchCalculation(employee, project))
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public List<MatchResultResponse> getProjectMatchResults(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isProjectManager = project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view match results for this project");
        }

        return matchResultRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public MatchResultResponse getMatchResultById(
            Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        MatchResult matchResult = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match result not found"));

        boolean isOwnerEmployee = matchResult.getEmployee().getUser().getId().equals(user.getId());
        boolean isProjectManager = matchResult.getProject().getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isOwnerEmployee && !isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view this match result");
        }

        return mapToResponse(matchResult);
    }

    public MatchExplanationResponse getMatchExplanation(
            Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        MatchResult matchResult = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match result not found"));

        boolean isOwnerEmployee = matchResult.getEmployee().getUser().getId().equals(user.getId());
        boolean isProjectManager = matchResult.getProject().getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isOwnerEmployee && !isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view explanation for this match result");
        }

        Employee employee = matchResult.getEmployee();
        Project project = matchResult.getProject();

        List<ProjectSkill> projectSkills = projectSkillRepository.findByProjectId(project.getId());
        List<EmployeeSkill> employeeSkills = employeeSkillRepository.findByEmployeeId(employee.getId());

        Set<String> employeeSkillNames = employeeSkills.stream()
                .filter(es -> es.getSkill() != null && es.getSkill().getName() != null)
                .map(es -> es.getSkill().getName().trim().toLowerCase())
                .collect(Collectors.toSet());

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (ProjectSkill ps : projectSkills) {
            if (ps.getSkill() != null && ps.getSkill().getName() != null) {
                String skillName = ps.getSkill().getName();
                if (employeeSkillNames.contains(skillName.trim().toLowerCase())) {
                    matchedSkills.add(skillName);
                } else {
                    missingSkills.add(skillName);
                }
            }
        }

        double skillsPoints = roundScore(matchResult.getSkillsScore() * 50.0);
        double experiencePoints = roundScore(matchResult.getExperienceScore() * 30.0);
        double certificationPoints = roundScore(matchResult.getCertificationScore() * 10.0);
        double availabilityPoints = roundScore(matchResult.getAvailabilityScore() * 5.0);
        double preferencePoints = roundScore(matchResult.getPreferenceScore() * 5.0);

        return new MatchExplanationResponse(
                matchResult.getId(),
                employee.getId(),
                employee.getUser().getName(),
                employee.getUser().getEmail(),
                employee.getDesignation(),
                employee.getDepartment(),
                project.getId(),
                project.getTitle(),
                matchResult.getMatchScore(),
                matchResult.getSkillsScore(),
                matchResult.getExperienceScore(),
                matchResult.getCertificationScore(),
                matchResult.getAvailabilityScore(),
                matchResult.getPreferenceScore(),
                skillsPoints,
                experiencePoints,
                certificationPoints,
                availabilityPoints,
                preferencePoints,
                matchedSkills,
                missingSkills,
                matchResult.getGeneratedAt());
    }

    public void deleteMatchResult(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        MatchResult matchResult = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match result not found"));

        boolean isProjectManager = matchResult.getProject().getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to delete this match result");
        }

        matchResultRepository.delete(matchResult);
    }

    // ==========================================
    // CORE MATCHING CALCULATION ENGINE
    // ==========================================

    private MatchResultResponse performMatchCalculation(Employee employee, Project project) {
        // 1. Skills Score (50%)
        List<ProjectSkill> projectSkills = projectSkillRepository.findByProjectId(project.getId());
        List<EmployeeSkill> employeeSkills = employeeSkillRepository.findByEmployeeId(employee.getId());

        double skillsScore;
        if (projectSkills.isEmpty()) {
            skillsScore = 0.0;
        } else {
            Map<Long, EmployeeSkill> empSkillMap = employeeSkills.stream()
                    .filter(es -> es.getSkill() != null)
                    .collect(Collectors.toMap(es -> es.getSkill().getId(), es -> es, (a, b) -> a));

            double totalWeightedRatio = 0.0;
            double totalImportance = 0.0;

            for (ProjectSkill ps : projectSkills) {
                int importance = Math.max(1, ps.getImportance());
                totalImportance += importance;

                if (ps.getSkill() != null) {
                    EmployeeSkill es = empSkillMap.get(ps.getSkill().getId());
                    if (es != null) {
                        double requiredProf = Math.max(1.0, (double) ps.getRequiredProficiency());
                        double empProf = es.getProficiency();
                        double ratio = Math.min(1.0, empProf / requiredProf);
                        totalWeightedRatio += ratio * importance;
                    }
                }
            }
            skillsScore = totalImportance > 0 ? (totalWeightedRatio / totalImportance) : 0.0;
        }

        // 2. Experience Score (30%)
        double empExp = employee.getExperience();
        double reqExp = project.getExperienceRequired();
        double experienceScore = reqExp <= 0.0 ? 1.0 : Math.min(1.0, empExp / reqExp);

        // 3. Certification Score (10%)
        List<Certification> certs = certificationRepository.findByEmployeeId(employee.getId());
        String today = LocalDate.now().toString();
        long activeCerts = certs.stream()
                .filter(c -> c.getExpiryDate() == null || c.getExpiryDate().isBlank()
                        || c.getExpiryDate().compareTo(today) >= 0)
                .count();
        double certificationScore = Math.min(1.0, activeCerts * 0.5);

        // 4. Availability Score (5%) - Baseline constant 1.0 (no availability schema)
        double availabilityScore = 1.0;

        // 5. Preference Score (5%) - Department alignment proxy
        String empDept = employee.getDepartment();
        String projDept = project.getDepartment();
        boolean deptMatch = empDept != null && projDept != null && empDept.trim().equalsIgnoreCase(projDept.trim());
        double preferenceScore = deptMatch ? 1.0 : 0.5;

        // Weighted Overall Score (Percentage 0.0 - 100.0)
        double rawMatchScore = (0.50 * skillsScore) +
                (0.30 * experienceScore) +
                (0.10 * certificationScore) +
                (0.05 * availabilityScore) +
                (0.05 * preferenceScore);

        double overallMatchScore = Math.round(rawMatchScore * 10000.0) / 100.0;

        // Atomic Upsert using composite unique key (employee_id, project_id)
        MatchResult matchResult = matchResultRepository
                .findByEmployeeIdAndProjectId(employee.getId(), project.getId())
                .orElse(new MatchResult());

        matchResult.setEmployee(employee);
        matchResult.setProject(project);
        matchResult.setSkillsScore(roundScore(skillsScore));
        matchResult.setExperienceScore(roundScore(experienceScore));
        matchResult.setCertificationScore(roundScore(certificationScore));
        matchResult.setAvailabilityScore(roundScore(availabilityScore));
        matchResult.setPreferenceScore(roundScore(preferenceScore));
        matchResult.setMatchScore(overallMatchScore);
        matchResult.setGeneratedAt(LocalDateTime.now().toString());

        MatchResult saved = matchResultRepository.save(matchResult);

        return mapToResponse(saved);
    }

    private double roundScore(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private MatchResultResponse mapToResponse(MatchResult matchResult) {
        Employee emp = matchResult.getEmployee();
        User user = emp.getUser();

        List<String> skills = employeeSkillRepository.findByEmployeeId(emp.getId())
                .stream()
                .filter(es -> es.getSkill() != null && es.getSkill().getName() != null)
                .map(es -> es.getSkill().getName())
                .toList();

        return new MatchResultResponse(
                matchResult.getId(),
                emp.getId(),
                user.getName(),
                user.getEmail(),
                emp.getDesignation(),
                emp.getDepartment(),
                emp.getExperience(),
                skills,
                matchResult.getProject().getId(),
                matchResult.getProject().getTitle(),
                matchResult.getMatchScore(),
                matchResult.getSkillsScore(),
                matchResult.getExperienceScore(),
                matchResult.getCertificationScore(),
                matchResult.getAvailabilityScore(),
                matchResult.getPreferenceScore(),
                matchResult.getGeneratedAt());
    }
}
