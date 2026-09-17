package com.employeematching.service;

import com.employeematching.dto.request.CertificationRequest;
import com.employeematching.dto.response.CertificationResponse;
import com.employeematching.entity.Certification;
import com.employeematching.entity.Employee;
import com.employeematching.entity.User;
import com.employeematching.repository.CertificationRepository;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public CertificationService(
            CertificationRepository certificationRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {

        this.certificationRepository = certificationRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public CertificationResponse addCertification(
            CertificationRequest request,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Certification certification = new Certification();

        certification.setEmployee(employee);
        certification.setName(request.getName());
        certification.setIssuingOrganization(
                request.getIssuingOrganization()
        );
        certification.setIssueDate(request.getIssueDate());
        certification.setExpiryDate(request.getExpiryDate());

        Certification saved =
                certificationRepository.save(certification);

        return mapToResponse(saved);
    }

    public List<CertificationResponse> getMyCertifications(
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        return certificationRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CertificationResponse getCertificationById(
            Long id,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Certification certification =
                certificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certification not found"));

        if (!certification.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException(
                    "You are not authorized to access this certification");
        }

        return mapToResponse(certification);
    }

    public CertificationResponse updateCertification(
            Long id,
            CertificationRequest request,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Certification certification =
                certificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certification not found"));

        if (!certification.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException(
                    "You are not authorized to modify this certification");
        }

        certification.setName(request.getName());
        certification.setIssuingOrganization(
                request.getIssuingOrganization()
        );
        certification.setIssueDate(request.getIssueDate());
        certification.setExpiryDate(request.getExpiryDate());

        Certification updated =
                certificationRepository.save(certification);

        return mapToResponse(updated);
    }

    public void deleteCertification(
            Long id,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Certification certification =
                certificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certification not found"));

        if (!certification.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException(
                    "You are not authorized to delete this certification");
        }

        certificationRepository.delete(certification);
    }

    private Employee getAuthenticatedEmployee(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee profile not found"));
    }

    private CertificationResponse mapToResponse(
            Certification certification) {

        return new CertificationResponse(
                certification.getId(),
                certification.getEmployee().getId(),
                certification.getName(),
                certification.getIssuingOrganization(),
                certification.getIssueDate(),
                certification.getExpiryDate()
        );
    }
}