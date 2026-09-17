package com.employeematching.repository;

import com.employeematching.entity.ProjectSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectSkillRepository extends JpaRepository<ProjectSkill, Long> {

    List<ProjectSkill> findByProjectId(Long projectId);

    Optional<ProjectSkill> findByProjectIdAndSkillId(Long projectId, Long skillId);
}