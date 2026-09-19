package com.employeematching.service;

import com.employeematching.dto.request.EmployeeSkillRequest;
import com.employeematching.dto.response.EmployeeSkillResponse;
import com.employeematching.entity.Employee;
import com.employeematching.entity.EmployeeSkill;
import com.employeematching.entity.Skill;
import com.employeematching.entity.User;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.EmployeeSkillRepository;
import com.employeematching.repository.SkillRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeSkillService {

    private final EmployeeSkillRepository employeeSkillRepository;
    private final EmployeeRepository employeeRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public EmployeeSkillService(
            EmployeeSkillRepository employeeSkillRepository,
            EmployeeRepository employeeRepository,
            SkillRepository skillRepository,
            UserRepository userRepository) {
        this.employeeSkillRepository = employeeSkillRepository;
        this.employeeRepository = employeeRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    public EmployeeSkillResponse addSkill(
            EmployeeSkillRequest request,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        Skill skill = skillRepository.findByNameIgnoreCase(request.getSkillName().trim())
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(request.getSkillName().trim());
                    return skillRepository.save(newSkill);
                });

        if (employeeSkillRepository.existsByEmployeeIdAndSkillId(
                employee.getId(),
                skill.getId())) {
            throw new RuntimeException("Employee already has this skill in profile");
        }

        EmployeeSkill employeeSkill = new EmployeeSkill();
        employeeSkill.setEmployee(employee);
        employeeSkill.setSkill(skill);
        employeeSkill.setProficiency(Math.max(1, Math.min(5, request.getProficiency())));
        employeeSkill.setYearsExperience(request.getYearsExperience() != null ? request.getYearsExperience() : 0.0);

        EmployeeSkill saved = employeeSkillRepository.save(employeeSkill);
        return mapToResponse(saved);
    }

    public EmployeeSkillResponse updateSkill(
            Long id,
            EmployeeSkillRequest request,
            Authentication authentication) {

        Employee employee = getAuthenticatedEmployee(authentication);

        EmployeeSkill es = employeeSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill record not found"));

        if (!es.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("Unauthorized to modify this skill");
        }

        es.setProficiency(Math.max(1, Math.min(5, request.getProficiency())));
        if (request.getYearsExperience() != null) {
            es.setYearsExperience(request.getYearsExperience());
        }

        EmployeeSkill updated = employeeSkillRepository.save(es);
        return mapToResponse(updated);
    }

    public void deleteSkill(Long id, Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);

        EmployeeSkill es = employeeSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill record not found"));

        if (!es.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("Unauthorized to remove this skill");
        }

        employeeSkillRepository.delete(es);
    }

    public List<EmployeeSkillResponse> getMySkills(Authentication authentication) {
        Employee employee = getAuthenticatedEmployee(authentication);
        return employeeSkillRepository.findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private Employee getAuthenticatedEmployee(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
    }

    private EmployeeSkillResponse mapToResponse(EmployeeSkill employeeSkill) {
        Skill skill = employeeSkill.getSkill();
        return new EmployeeSkillResponse(
                employeeSkill.getId(),
                skill.getId(),
                skill.getName(),
                employeeSkill.getProficiency(),
                employeeSkill.getYearsExperience()
        );
    }
}