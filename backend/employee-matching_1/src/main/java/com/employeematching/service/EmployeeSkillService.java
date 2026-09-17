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

        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Employee profile not found"));

        Skill skill = skillRepository.findByNameIgnoreCase(request.getSkillName())
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(request.getSkillName().trim());
                    return skillRepository.save(newSkill);
                });

        if (employeeSkillRepository.existsByEmployeeIdAndSkillId(
                employee.getId(),
                skill.getId())) {

            throw new RuntimeException("Employee already has this skill");
        }

        EmployeeSkill employeeSkill = new EmployeeSkill();

        employeeSkill.setEmployee(employee);
        employeeSkill.setSkill(skill);
        employeeSkill.setProficiency(request.getProficiency());
        employeeSkill.setYearsExperience(request.getYearsExperience());

        EmployeeSkill saved = employeeSkillRepository.save(employeeSkill);

        return mapToResponse(saved);
    }

    public List<EmployeeSkillResponse> getMySkills(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Employee profile not found"));

        return employeeSkillRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private User getAuthenticatedUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));
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