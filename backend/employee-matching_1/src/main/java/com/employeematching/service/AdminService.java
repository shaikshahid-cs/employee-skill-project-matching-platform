package com.employeematching.service;

import com.employeematching.dto.response.AdminStatsResponse;
import com.employeematching.dto.response.UserResponse;
import com.employeematching.entity.User;
import com.employeematching.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;
    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private final SkillRepository skillRepository;
    private final MatchResultRepository matchResultRepository;

    public AdminService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            ManagerRepository managerRepository,
            ProjectRepository projectRepository,
            ApplicationRepository applicationRepository,
            SkillRepository skillRepository,
            MatchResultRepository matchResultRepository) {

        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
        this.projectRepository = projectRepository;
        this.applicationRepository = applicationRepository;
        this.skillRepository = skillRepository;
        this.matchResultRepository = matchResultRepository;
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

    public AdminStatsResponse getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalEmployees = employeeRepository.count();
        long totalManagers = managerRepository.count();
        long totalProjects = projectRepository.count();
        long openProjects = projectRepository.findByStatus("OPEN").size();
        long totalApplications = applicationRepository.count();
        long totalSkills = skillRepository.count();
        long totalMatchResults = matchResultRepository.count();

        return new AdminStatsResponse(
                totalUsers,
                totalEmployees,
                totalManagers,
                totalProjects,
                openProjects,
                totalApplications,
                totalSkills,
                totalMatchResults
        );
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
