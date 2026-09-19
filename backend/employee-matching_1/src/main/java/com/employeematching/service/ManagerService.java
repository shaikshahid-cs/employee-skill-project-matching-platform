package com.employeematching.service;

import com.employeematching.dto.request.ManagerProfileRequest;
import com.employeematching.dto.response.ManagerProfileResponse;
import com.employeematching.entity.Manager;
import com.employeematching.entity.User;
import com.employeematching.repository.ManagerRepository;
import com.employeematching.repository.ProjectRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public ManagerService(
            ManagerRepository managerRepository,
            UserRepository userRepository,
            ProjectRepository projectRepository) {
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    public ManagerProfileResponse getMyProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Manager m = new Manager();
                    m.setUser(user);
                    return managerRepository.save(m);
                });

        return mapToResponse(manager);
    }

    @Transactional
    public ManagerProfileResponse updateProfile(
            ManagerProfileRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Manager m = new Manager();
                    m.setUser(user);
                    return m;
                });

        if (request.getDepartment() != null) {
            manager.setDepartment(request.getDepartment().trim());
        }
        if (request.getPhone() != null) {
            manager.setPhone(request.getPhone().trim());
        }

        Manager saved = managerRepository.save(manager);
        return mapToResponse(saved);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private ManagerProfileResponse mapToResponse(Manager manager) {
        User user = manager.getUser();
        int projectsCount = (int) projectRepository.findByManagerId(manager.getId()).size();

        return new ManagerProfileResponse(
                manager.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                manager.getDepartment(),
                manager.getPhone(),
                projectsCount
        );
    }
}