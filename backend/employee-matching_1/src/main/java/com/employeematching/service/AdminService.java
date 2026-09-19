package com.employeematching.service;

import com.employeematching.dto.request.CreateUserRequest;
import com.employeematching.dto.response.CreateUserResponse;
import com.employeematching.dto.response.UserResponse;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final MatchResultRepository matchResultRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public AdminService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            ManagerRepository managerRepository,
            EmployeeSkillRepository employeeSkillRepository,
            EducationRepository educationRepository,
            CertificationRepository certificationRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            ProjectSkillRepository projectSkillRepository,
            ProjectAssignmentRepository projectAssignmentRepository,
            MatchResultRepository matchResultRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.educationRepository = educationRepository;
        this.certificationRepository = certificationRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.projectAssignmentRepository = projectAssignmentRepository;
        this.matchResultRepository = matchResultRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    @Transactional
    public CreateUserResponse createEmployee(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("A user with email " + request.getEmail() + " already exists");
        }

        String tempPassword = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword().trim()
                : generateTemporaryPassword("Emp");

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName().trim());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(User.Role.EMPLOYEE);
        user.setActive(true);
        user.setMustChangePassword(true);
        User savedUser = userRepository.save(user);

        Employee employee = new Employee();
        employee.setUser(savedUser);
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setPhone(request.getPhone());
        if (request.getPrimaryDomain() != null) {
            employee.setPrimaryDomain(request.getPrimaryDomain());
        }
        if (request.getTotalExperienceYears() != null) {
            employee.setTotalExperienceYears(request.getTotalExperienceYears());
        }
        if (request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getLocation() != null) {
            employee.setLocation(request.getLocation());
        }
        employeeRepository.save(employee);

        return new CreateUserResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                tempPassword,
                savedUser.isActive(),
                savedUser.isMustChangePassword()
        );
    }

    @Transactional
    public CreateUserResponse createManager(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("A user with email " + request.getEmail() + " already exists");
        }

        String tempPassword = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword().trim()
                : generateTemporaryPassword("Mgr");

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName().trim());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(User.Role.MANAGER);
        user.setActive(true);
        user.setMustChangePassword(true);
        User savedUser = userRepository.save(user);

        Manager manager = new Manager();
        manager.setUser(savedUser);
        manager.setDepartment(request.getDepartment());
        manager.setPhone(request.getPhone());
        managerRepository.save(manager);

        return new CreateUserResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                tempPassword,
                savedUser.isActive(),
                savedUser.isMustChangePassword()
        );
    }

    public UserResponse toggleUserStatus(Long userId, boolean active, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Admin cannot deactivate their own account");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        targetUser.setActive(active);
        User updated = userRepository.save(targetUser);
        return mapToUserResponse(updated);
    }

    public Map<String, String> resetUserPassword(Long userId, String customPassword, Authentication authentication) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String tempPassword = (customPassword != null && !customPassword.isBlank())
                ? customPassword.trim()
                : generateTemporaryPassword("Reset");
        targetUser.setPassword(passwordEncoder.encode(tempPassword));
        targetUser.setMustChangePassword(true);
        userRepository.save(targetUser);

        return Map.of(
                "message", "Password reset successfully",
                "email", targetUser.getEmail(),
                "temporaryPassword", tempPassword
        );
    }

    public Map<String, String> resetUserPassword(Long userId, Authentication authentication) {
        return resetUserPassword(userId, null, authentication);
    }

    @Transactional
    public void deleteUser(Long userId, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Admin cannot delete their own account");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (targetUser.getRole() == User.Role.EMPLOYEE) {
            employeeRepository.findByUserId(userId).ifPresent(employee -> {
                matchResultRepository.deleteAll(matchResultRepository.findByEmployeeId(employee.getId()));
                projectAssignmentRepository.deleteAll(projectAssignmentRepository.findByEmployeeId(employee.getId()));
                employeeSkillRepository.deleteAll(employeeSkillRepository.findByEmployeeId(employee.getId()));
                educationRepository.deleteAll(educationRepository.findByEmployeeId(employee.getId()));
                certificationRepository.deleteAll(certificationRepository.findByEmployeeId(employee.getId()));
                experienceRepository.deleteAll(experienceRepository.findByEmployeeId(employee.getId()));
                employeeRepository.delete(employee);
            });
        } else if (targetUser.getRole() == User.Role.MANAGER) {
            managerRepository.findByUserId(userId).ifPresent(manager -> {
                List<Project> projects = projectRepository.findByManagerId(manager.getId());
                for (Project p : projects) {
                    matchResultRepository.deleteAll(matchResultRepository.findByProjectId(p.getId()));
                    projectAssignmentRepository.deleteAll(projectAssignmentRepository.findByProjectId(p.getId()));
                    projectSkillRepository.deleteByProjectId(p.getId());
                    projectRepository.delete(p);
                }
                managerRepository.delete(manager);
            });
        }

        userRepository.delete(targetUser);
    }

    public Map<String, Object> getOverviewStats() {
        long totalUsers = userRepository.count();
        long totalEmployees = userRepository.countByRole(User.Role.EMPLOYEE);
        long totalManagers = userRepository.countByRole(User.Role.MANAGER);
        long totalActive = userRepository.countByIsActive(true);
        long totalInactive = userRepository.countByIsActive(false);
        long totalProjects = projectRepository.count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalEmployees", totalEmployees);
        stats.put("totalManagers", totalManagers);
        stats.put("activeAccounts", totalActive);
        stats.put("inactiveAccounts", totalInactive);
        stats.put("totalProjects", totalProjects);

        return stats;
    }

    private String generateTemporaryPassword(String prefix) {
        StringBuilder sb = new StringBuilder(prefix).append("@");
        for (int i = 0; i < 6; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.isMustChangePassword(),
                user.getCreatedAt()
        );
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
}
