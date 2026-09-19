package com.employeematching.dto.response;

import java.util.List;

public class ProjectResponse {

    private Long id;
    private Long managerId;
    private String managerName;
    private String title;
    private String description;
    private String department;
    private String location;
    private String workMode;
    private String requiredRole;
    private boolean isRoleMandatory;
    private String requiredDomain;
    private boolean isDomainMandatory;
    private double minExperienceYears;
    private boolean isExperienceMandatory;
    private String requiredDegreeLevel;
    private String requiredDegreeField;
    private boolean isEducationMandatory;
    private String requiredCertification;
    private boolean isCertificationMandatory;
    private String status;
    private int assignedCount;
    private List<ProjectSkillResponse> skills;

    public ProjectResponse() {
    }

    public ProjectResponse(
            Long id,
            Long managerId,
            String managerName,
            String title,
            String description,
            String department,
            String location,
            String workMode,
            String requiredRole,
            boolean isRoleMandatory,
            String requiredDomain,
            boolean isDomainMandatory,
            double minExperienceYears,
            boolean isExperienceMandatory,
            String requiredDegreeLevel,
            String requiredDegreeField,
            boolean isEducationMandatory,
            String requiredCertification,
            boolean isCertificationMandatory,
            String status,
            int assignedCount,
            List<ProjectSkillResponse> skills) {
        this.id = id;
        this.managerId = managerId;
        this.managerName = managerName;
        this.title = title;
        this.description = description;
        this.department = department;
        this.location = location;
        this.workMode = workMode;
        this.requiredRole = requiredRole;
        this.isRoleMandatory = isRoleMandatory;
        this.requiredDomain = requiredDomain;
        this.isDomainMandatory = isDomainMandatory;
        this.minExperienceYears = minExperienceYears;
        this.isExperienceMandatory = isExperienceMandatory;
        this.requiredDegreeLevel = requiredDegreeLevel;
        this.requiredDegreeField = requiredDegreeField;
        this.isEducationMandatory = isEducationMandatory;
        this.requiredCertification = requiredCertification;
        this.isCertificationMandatory = isCertificationMandatory;
        this.status = status;
        this.assignedCount = assignedCount;
        this.skills = skills;
    }

    public Long getId() {
        return id;
    }

    public Long getManagerId() {
        return managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDepartment() {
        return department;
    }

    public String getLocation() {
        return location;
    }

    public String getWorkMode() {
        return workMode;
    }

    public String getRequiredRole() {
        return requiredRole;
    }

    public boolean isRoleMandatory() {
        return isRoleMandatory;
    }

    public String getRequiredDomain() {
        return requiredDomain;
    }

    public boolean isDomainMandatory() {
        return isDomainMandatory;
    }

    public double getMinExperienceYears() {
        return minExperienceYears;
    }

    // Compatibility getter
    public double getExperienceRequired() {
        return minExperienceYears;
    }

    public boolean isExperienceMandatory() {
        return isExperienceMandatory;
    }

    public String getRequiredDegreeLevel() {
        return requiredDegreeLevel;
    }

    public String getRequiredDegreeField() {
        return requiredDegreeField;
    }

    public boolean isEducationMandatory() {
        return isEducationMandatory;
    }

    public String getRequiredCertification() {
        return requiredCertification;
    }

    public boolean isCertificationMandatory() {
        return isCertificationMandatory;
    }

    public String getStatus() {
        return status;
    }

    public int getAssignedCount() {
        return assignedCount;
    }

    public List<ProjectSkillResponse> getSkills() {
        return skills;
    }
}