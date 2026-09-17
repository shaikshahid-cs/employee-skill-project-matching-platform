package com.employeematching.repository;

import com.employeematching.entity.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeSkillRepository
        extends JpaRepository<EmployeeSkill, Long> {

    List<EmployeeSkill> findByEmployeeId(Long employeeId);

    Optional<EmployeeSkill> findByEmployeeIdAndSkillId(
            Long employeeId,
            Long skillId
    );

    boolean existsByEmployeeIdAndSkillId(
            Long employeeId,
            Long skillId
    );
}