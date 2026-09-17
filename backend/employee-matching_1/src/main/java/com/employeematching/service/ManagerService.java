package com.employeematching.service;

import com.employeematching.dto.request.ManagerProfileRequest;
import com.employeematching.dto.response.ManagerProfileResponse;
import com.employeematching.entity.Manager;
import com.employeematching.entity.User;
import com.employeematching.repository.ManagerRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;

    public ManagerService(
            ManagerRepository managerRepository,
            UserRepository userRepository) {

        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
    }

    public ManagerProfileResponse createProfile(
            ManagerProfileRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        if (user.getRole() != User.Role.MANAGER) {
            throw new RuntimeException("Only users with MANAGER role can create a manager profile");
        }

        if (managerRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("Manager profile already exists");
        }

        Manager manager = new Manager();

        manager.setUser(user);
        manager.setDepartment(request.getDepartment());
        manager.setDesignation(request.getDesignation());

        Manager savedManager = managerRepository.save(manager);

        return mapToResponse(savedManager);
    }

    public ManagerProfileResponse getMyProfile(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Manager manager = managerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Manager profile not found"));

        return mapToResponse(manager);
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));
    }

    private ManagerProfileResponse mapToResponse(Manager manager) {

        User user = manager.getUser();

        return new ManagerProfileResponse(
                manager.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                manager.getDepartment(),
                manager.getDesignation()
        );
    }
}