package com.employeematching.service;

import com.employeematching.dto.request.EmployeeProfileRequest;
import com.employeematching.dto.response.EmployeeProfileResponse;
import com.employeematching.entity.Employee;
import com.employeematching.entity.User;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public EmployeeProfileResponse createProfile(
            EmployeeProfileRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("Only users with EMPLOYEE role can create an employee profile");
        }

        if (employeeRepository.existsByUserId(user.getId())) {
            throw new RuntimeException("Employee profile already exists");
        }

        Employee employee = new Employee();

        employee.setUser(user);
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setExperience(request.getExperience());

        Employee savedEmployee = employeeRepository.save(employee);

        return mapToResponse(savedEmployee);
    }

    public EmployeeProfileResponse getMyProfile(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Employee profile not found"));

        return mapToResponse(employee);
    }

    private User getAuthenticatedUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));
    }

    private EmployeeProfileResponse mapToResponse(Employee employee) {

        User user = employee.getUser();

        return new EmployeeProfileResponse(
                employee.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getExperience()
        );
    }
}