package com.employeematching.repository;

import com.employeematching.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobDescriptionRepository
        extends JpaRepository<JobDescription, Long> {

    Optional<JobDescription> findByProjectId(Long projectId);

    boolean existsByProjectId(Long projectId);
}