package com.employeematching.dto.response;

import java.util.ArrayList;
import java.util.List;

public class JdExtractionPreviewDTO {

    private String title;
    private String description;

    private String requiredRole;
    private boolean isRoleMandatory = false;

    private String requiredDomain;
    private boolean isDomainMandatory = false;

    private Double minExperienceYears;
    private boolean isExperienceMandatory = false;

    private String requiredDegreeLevel;
    private String requiredDegreeField;
    private boolean isEducationMandatory = false;

    private String requiredCertification;
    private boolean isCertificationMandatory = false;

    private List<ExtractedJdSkill> skills = new ArrayList<>();

    public static class ExtractedJdSkill {
        private String skillName;
        private int minProficiency = 1;
        private int importance = 3;
        private boolean isMandatory = false;
        private String confidence; // HIGH, MEDIUM, LOW

        public ExtractedJdSkill() {
        }

        public ExtractedJdSkill(String skillName, int minProficiency, int importance, boolean isMandatory, String confidence) {
            this.skillName = skillName;
            this.minProficiency = minProficiency;
            this.importance = importance;
            this.isMandatory = isMandatory;
            this.confidence = confidence;
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

        public String getConfidence() {
            return confidence;
        }

        public void setConfidence(String confidence) {
            this.confidence = confidence;
        }
    }

    public JdExtractionPreviewDTO() {
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

    public Double getMinExperienceYears() {
        return minExperienceYears;
    }

    public void setMinExperienceYears(Double minExperienceYears) {
        this.minExperienceYears = minExperienceYears;
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

    public List<ExtractedJdSkill> getSkills() {
        return skills;
    }

    public void setSkills(List<ExtractedJdSkill> skills) {
        this.skills = skills;
    }
}
