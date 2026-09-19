package com.employeematching.service;

import com.employeematching.dto.request.EmployeeProfileRequest;
import com.employeematching.dto.response.EmployeeProfileResponse;
import com.employeematching.entity.Employee;
import com.employeematching.entity.User;
import com.employeematching.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final ExperienceRepository experienceRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            EmployeeSkillRepository employeeSkillRepository,
            EducationRepository educationRepository,
            CertificationRepository certificationRepository,
            ExperienceRepository experienceRepository) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.educationRepository = educationRepository;
        this.certificationRepository = certificationRepository;
        this.experienceRepository = experienceRepository;
    }

    public EmployeeProfileResponse getMyProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Employee newEmp = new Employee();
                    newEmp.setUser(user);
                    return employeeRepository.save(newEmp);
                });

        return mapToResponse(employee);
    }

    @Transactional
    public EmployeeProfileResponse updateProfile(
            EmployeeProfileRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Employee newEmp = new Employee();
                    newEmp.setUser(user);
                    return newEmp;
                });

        if (request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getLocation() != null) {
            employee.setLocation(request.getLocation());
        }
        if (request.getDesignation() != null) {
            employee.setDesignation(request.getDesignation());
        }
        if (request.getTotalExperienceYears() != null) {
            employee.setTotalExperienceYears(request.getTotalExperienceYears());
        }
        if (request.getPrimaryDomain() != null) {
            employee.setPrimaryDomain(request.getPrimaryDomain());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getSummary() != null) {
            employee.setSummary(request.getSummary());
        }

        Employee saved = employeeRepository.save(employee);
        return mapToResponse(saved);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private EmployeeProfileResponse mapToResponse(Employee employee) {
        User user = employee.getUser();
        Long empId = employee.getId();

        int skillsCount = (int) employeeSkillRepository.findByEmployeeId(empId).size();
        int educationCount = (int) educationRepository.findByEmployeeId(empId).size();
        int certsCount = (int) certificationRepository.findByEmployeeId(empId).size();
        int expCount = (int) experienceRepository.findByEmployeeId(empId).size();

        return new EmployeeProfileResponse(
                employee.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                employee.getDateOfBirth(),
                employee.getPhone(),
                employee.getLocation(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getTotalExperienceYears(),
                employee.getPrimaryDomain(),
                employee.getSummary(),
                skillsCount,
                educationCount,
                certsCount,
                expCount
        );
    }
}