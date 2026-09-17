package com.employeematching.repository;

import com.employeematching.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByEmployeeId(Long employeeId);
}