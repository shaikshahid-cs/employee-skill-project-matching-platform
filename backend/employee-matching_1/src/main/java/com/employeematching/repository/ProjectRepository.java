package com.employeematching.repository;

import com.employeematching.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByManagerId(Long managerId);

    List<Project> findByStatus(String status);
}