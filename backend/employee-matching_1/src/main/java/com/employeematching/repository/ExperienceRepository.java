package com.employeematching.repository;

import com.employeematching.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findByEmployeeId(Long employeeId);

    List<Experience> findByEmployeeIdOrderByStartDateDesc(Long employeeId);
}
