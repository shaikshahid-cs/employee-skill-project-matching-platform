package com.employeematching.repository;

import com.employeematching.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByEmployeeId(Long employeeId);

    List<Application> findByProjectId(Long projectId);

    Optional<Application> findByEmployeeIdAndProjectId(Long employeeId, Long projectId);
}