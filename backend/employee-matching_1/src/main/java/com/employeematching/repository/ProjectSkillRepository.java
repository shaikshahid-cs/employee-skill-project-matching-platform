package com.employeematching.repository;

import com.employeematching.entity.ProjectSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ProjectSkillRepository extends JpaRepository<ProjectSkill, Long> {

    List<ProjectSkill> findByProjectId(Long projectId);

    Optional<ProjectSkill> findByProjectIdAndSkillId(Long projectId, Long skillId);

    @Transactional
    void deleteByProjectId(Long projectId);

    @Transactional
    void deleteByProjectIdAndSkillId(Long projectId, Long skillId);
}