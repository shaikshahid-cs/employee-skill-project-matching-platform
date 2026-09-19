package com.employeematching.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String department;
    private String location;
    private String workMode = "REMOTE"; // REMOTE, HYBRID, ONSITE

    @NotBlank(message = "Required role is required")
    private String requiredRole;

    private boolean isRoleMandatory = true;

    @NotBlank(message = "Required domain is required")
    private String requiredDomain;

    private boolean isDomainMandatory = false;

    private Double minExperienceYears = 0.0;
    private boolean isExperienceMandatory = true;

    private String requiredDegreeLevel;
    private String requiredDegreeField;
    private boolean isEducationMandatory = false;

    private String requiredCertification;
    private boolean isCertificationMandatory = false;

    private String status = "OPEN";

    private List<ProjectSkillItem> skills;

    public static class ProjectSkillItem {
        private String skillName;
        private int minProficiency = 1;
        private int importance = 3;
        private boolean isMandatory = false;

        public ProjectSkillItem() {
        }

        public ProjectSkillItem(String skillName, int minProficiency, int importance, boolean isMandatory) {
            this.skillName = skillName;
            this.minProficiency = minProficiency;
            this.importance = importance;
            this.isMandatory = isMandatory;
        }

        public String getSkillName() {
            return skillName;
        }

        public void setSkillName(String skillName) {
            this.skillName = skillName;
        }

        public int getMinProficiency() {
            return minProficiency;
        }

        public void setMinProficiency(int minProficiency) {
            this.minProficiency = minProficiency;
        }

        public int getImportance() {
            return importance;
        }

        public void setImportance(int importance) {
            this.importance = importance;
        }

        public boolean isMandatory() {
            return isMandatory;
        }

        public void setMandatory(boolean mandatory) {
            isMandatory = mandatory;
        }
    }

    public ProjectRequest() {
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

    public void setPrimaryDomain(String primaryDomain) {
        if (this.requiredDomain == null) {
            this.requiredDomain = primaryDomain;
        }
    }

    public void setDomain(String domain) {
        if (this.requiredDomain == null) {
            this.requiredDomain = domain;
        }
    }

    public boolean isDomainMandatory() {
        return isDomainMandatory;
    }

    public void setDomainMandatory(boolean domainMandatory) {
        this.isDomainMandatory = domainMandatory;
    }

    public Double getMinExperienceYears() {
        return minExperienceYears;
    }

    public void setMinExperienceYears(Double minExperienceYears) {
        this.minExperienceYears = minExperienceYears;
    }

    // Compatibility getter/setter
    public Double getExperienceRequired() {
        return minExperienceYears != null ? minExperienceYears : 0.0;
    }

    public void setExperienceRequired(Double experienceRequired) {
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

    public List<ProjectSkillItem> getSkills() {
        return skills;
    }

    public void setSkills(List<ProjectSkillItem> skills) {
        this.skills = skills;
    }

    public void setRequiredSkills(List<ProjectSkillItem> requiredSkills) {
        if (this.skills == null) {
            this.skills = requiredSkills;
        }
    }

    public void setMinEducationLevel(String minEducationLevel) {
        if (this.requiredDegreeLevel == null) {
            this.requiredDegreeLevel = minEducationLevel;
        }
    }
}