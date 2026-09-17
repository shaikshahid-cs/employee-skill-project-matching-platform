package com.employeematching.repository;

import com.employeematching.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByEmployeeId(Long employeeId);
}