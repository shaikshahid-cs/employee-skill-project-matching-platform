package com.employeematching.service;

import com.employeematching.dto.request.EducationRequest;
import com.employeematching.dto.response.EducationResponse;
import com.employeematching.entity.Education;
import com.employeematching.entity.Employee;
import com.employeematching.entity.User;
import com.employeematching.repository.EducationRepository;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationService {

    private final EducationRepository educationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public EducationService(
            EducationRepository educationRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {
        this.educationRepository = educationRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public EducationResponse addEducation(
            EducationRequest request,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Education education = new Education();
        education.setEmployee(employee);
        education.setDegree(request.getDegree().trim());
        education.setDegreeLevel(request.getDegreeLevel() != null ? request.getDegreeLevel().trim() : inferDegreeLevel(request.getDegree()));
        education.setFieldOfStudy(request.getFieldOfStudy() != null ? request.getFieldOfStudy().trim() : "");
        education.setInstitution(request.getInstitution().trim());
        education.setStartYear(request.getStartYear() != null ? request.getStartYear() : 0);
        education.setGraduationYear(request.getGraduationYear());
        education.setGradeGpa(request.getGradeGpa());

        Education saved = educationRepository.save(education);
        return mapToResponse(saved);
    }

    public List<EducationResponse> getMyEducation(Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);
        return educationRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EducationResponse getEducationById(Long id, Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);

        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        if (!education.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("You are not authorized to access this education");
        }

        return mapToResponse(education);
    }

    public EducationResponse updateEducation(
            Long id,
            EducationRequest request,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        if (!education.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("You are not authorized to update this education");
        }

        education.setDegree(request.getDegree().trim());
        education.setDegreeLevel(request.getDegreeLevel() != null ? request.getDegreeLevel().trim() : inferDegreeLevel(request.getDegree()));
        education.setFieldOfStudy(request.getFieldOfStudy() != null ? request.getFieldOfStudy().trim() : "");
        education.setInstitution(request.getInstitution().trim());
        education.setStartYear(request.getStartYear() != null ? request.getStartYear() : 0);
        education.setGraduationYear(request.getGraduationYear());
        education.setGradeGpa(request.getGradeGpa());

        Education updated = educationRepository.save(education);
        return mapToResponse(updated);
    }

    public void deleteEducation(Long id, Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);

        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        if (!education.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("You are not authorized to delete this education");
        }

        educationRepository.delete(education);
    }

    private String inferDegreeLevel(String degree) {
        if (degree == null) return "BACHELOR";
        String lower = degree.toLowerCase();
        if (lower.contains("phd") || lower.contains("doctor")) return "DOCTORATE";
        if (lower.contains("master") || lower.contains("m.s") || lower.contains("mtech") || lower.contains("m.tech") || lower.contains("mba")) return "MASTER";
        if (lower.contains("diploma") || lower.contains("associate")) return "DIPLOMA";
        return "BACHELOR";
    }

    private Employee getAuthenticatedEmployee(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
    }

    private EducationResponse mapToResponse(Education education) {
        return new EducationResponse(
                education.getId(),
                education.getDegree(),
                education.getDegreeLevel(),
                education.getFieldOfStudy(),
                education.getInstitution(),
                education.getStartYear(),
                education.getGraduationYear(),
                education.getGradeGpa()
        );
    }
}