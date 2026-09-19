package com.employeematching.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private Manager manager;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String location;

    @Column(name = "work_mode", length = 50)
    private String workMode = "REMOTE"; // REMOTE, HYBRID, ONSITE

    @Column(name = "required_role", nullable = false, length = 100)
    private String requiredRole;

    @Column(name = "is_role_mandatory", nullable = false)
    private boolean isRoleMandatory = true;

    @Column(name = "required_domain", nullable = false, length = 100)
    private String requiredDomain;

    @Column(name = "is_domain_mandatory", nullable = false)
    private boolean isDomainMandatory = false;

    @Column(name = "min_experience_years", nullable = false)
    private double minExperienceYears = 0.0;

    @Column(name = "is_experience_mandatory", nullable = false)
    private boolean isExperienceMandatory = true;

    @Column(name = "required_degree_level", length = 50)
    private String requiredDegreeLevel;

    @Column(name = "required_degree_field", length = 150)
    private String requiredDegreeField;

    @Column(name = "is_education_mandatory", nullable = false)
    private boolean isEducationMandatory = false;

    @Column(name = "required_certification", length = 200)
    private String requiredCertification;

    @Column(name = "is_certification_mandatory", nullable = false)
    private boolean isCertificationMandatory = false;

    @Column(length = 30)
    private String status = "OPEN"; // OPEN, ACTIVE, COMPLETED, ARCHIVED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Project() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public String getRequiredRole() {
        return requiredRole;
    }

    public void setRequiredRole(String requiredRole) {
        this.requiredRole = requiredRole;
    }

    public boolean isRoleMandatory() {
        return isRoleMandatory;
    }

    public void setRoleMandatory(boolean roleMandatory) {
        isRoleMandatory = roleMandatory;
    }

    public String getRequiredDomain() {
        return requiredDomain;
    }

    public void setRequiredDomain(String requiredDomain) {
        this.requiredDomain = requiredDomain;
    }

    public boolean isDomainMandatory() {
        return isDomainMandatory;
    }

    public void setDomainMandatory(boolean domainMandatory) {
        isDomainMandatory = domainMandatory;
    }

    public double getMinExperienceYears() {
        return minExperienceYears;
    }

    public void setMinExperienceYears(double minExperienceYears) {
        this.minExperienceYears = minExperienceYears;
    }

    // Compatibility getter/setter
    public double getExperienceRequired() {
        return minExperienceYears;
    }

    public void setExperienceRequired(double experienceRequired) {
        this.minExperienceYears = experienceRequired;
    }

    public boolean isExperienceMandatory() {
        return isExperienceMandatory;
    }

    public void setExperienceMandatory(boolean experienceMandatory) {
        isExperienceMandatory = experienceMandatory;
    }

    public String getRequiredDegreeLevel() {
        return requiredDegreeLevel;
    }

    public void setRequiredDegreeLevel(String requiredDegreeLevel) {
        this.requiredDegreeLevel = requiredDegreeLevel;
    }

    public String getRequiredDegreeField() {
        return requiredDegreeField;
    }

    public void setRequiredDegreeField(String requiredDegreeField) {
        this.requiredDegreeField = requiredDegreeField;
    }

    public boolean isEducationMandatory() {
        return isEducationMandatory;
    }

    public void setEducationMandatory(boolean educationMandatory) {
        isEducationMandatory = educationMandatory;
    }

    public String getRequiredCertification() {
        return requiredCertification;
    }

    public void setRequiredCertification(String requiredCertification) {
        this.requiredCertification = requiredCertification;
    }

    public boolean isCertificationMandatory() {
        return isCertificationMandatory;
    }

    public void setCertificationMandatory(boolean certificationMandatory) {
        isCertificationMandatory = certificationMandatory;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}