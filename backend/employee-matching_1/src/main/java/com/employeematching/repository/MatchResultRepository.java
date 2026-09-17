package com.employeematching.repository;

import com.employeematching.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {

    List<MatchResult> findByEmployeeId(Long employeeId);

    List<MatchResult> findByProjectId(Long projectId);

    Optional<MatchResult> findByEmployeeIdAndProjectId(Long employeeId, Long projectId);
}