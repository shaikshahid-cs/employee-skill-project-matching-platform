package com.employeematching.service;

import com.employeematching.dto.request.ExperienceRequest;
import com.employeematching.dto.response.ExperienceResponse;
import com.employeematching.entity.Employee;
import com.employeematching.entity.Experience;
import com.employeematching.entity.User;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.ExperienceRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public ExperienceService(
            ExperienceRepository experienceRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {
        this.experienceRepository = experienceRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public List<ExperienceResponse> getMyExperiences(Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);
        return experienceRepository.findByEmployeeIdOrderByStartDateDesc(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExperienceResponse addExperience(ExperienceRequest request, Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);

        Experience exp = new Experience();
        exp.setEmployee(employee);
        exp.setCompany(request.getCompany());
        exp.setRoleTitle(request.getRoleTitle());
        exp.setStartDate(request.getStartDate());
        exp.setEndDate(request.getEndDate());
        exp.setCurrent(request.isCurrent());
        exp.setDomain(request.getDomain());
        exp.setTechnologiesUsed(request.getTechnologiesUsed());
        exp.setResponsibilitiesSummary(request.getResponsibilitiesSummary());

        Experience saved = experienceRepository.save(exp);
        return mapToResponse(saved);
    }

    public ExperienceResponse updateExperience(Long id, ExperienceRequest request, Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);

        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience record not found"));

        if (!exp.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("Unauthorized to modify this experience record");
        }

        exp.setCompany(request.getCompany());
        exp.setRoleTitle(request.getRoleTitle());
        exp.setStartDate(request.getStartDate());
        exp.setEndDate(request.getEndDate());
        exp.setCurrent(request.isCurrent());
        exp.setDomain(request.getDomain());
        exp.setTechnologiesUsed(request.getTechnologiesUsed());
        exp.setResponsibilitiesSummary(request.getResponsibilitiesSummary());

        Experience saved = experienceRepository.save(exp);
        return mapToResponse(saved);
    }

    public void deleteExperience(Long id, Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);

        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience record not found"));

        if (!exp.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("Unauthorized to delete this experience record");
        }

        experienceRepository.delete(exp);
    }

    private Employee getAuthenticatedEmployee(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
    }

    private ExperienceResponse mapToResponse(Experience exp) {
        return new ExperienceResponse(
                exp.getId(),
                exp.getEmployee().getId(),
                exp.getCompany(),
                exp.getRoleTitle(),
                exp.getStartDate(),
                exp.getEndDate(),
                exp.isCurrent(),
                exp.getDomain(),
                exp.getTechnologiesUsed(),
                exp.getResponsibilitiesSummary()
        );
    }
}
