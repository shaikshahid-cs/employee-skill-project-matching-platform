package com.employeematching.dto.response;

import java.util.ArrayList;
import java.util.List;

public class ResumeExtractionPreviewDTO {

    private ExtractedField<String> fullName;
    private ExtractedField<String> email;
    private ExtractedField<String> phone;
    private ExtractedField<String> location;
    private ExtractedField<String> designation;
    private ExtractedField<String> summary;

    private List<ExtractedSkill> skills = new ArrayList<>();
    private List<ExtractedEducation> education = new ArrayList<>();
    private List<ExtractedExperience> experience = new ArrayList<>();
    private List<ExtractedCertification> certifications = new ArrayList<>();

    public static class ExtractedField<T> {
        private T value;
        private String confidence; // HIGH, MEDIUM, LOW

        public ExtractedField() {
        }

        public ExtractedField(T value, String confidence) {
            this.value = value;
            this.confidence = confidence;
        }

        public T getValue() {
            return value;
        }

        public void setValue(T value) {
            this.value = value;
        }

        public String getConfidence() {
            return confidence;
        }

        public void setConfidence(String confidence) {
            this.confidence = confidence;
        }
    }

    public static class ExtractedSkill {
        private String skillName;
        private Integer proficiency; // Left null if unstated, never fake defaulted!
        private Double yearsOfExperience;
        private String confidence;

        public ExtractedSkill() {
        }

        public ExtractedSkill(String skillName, Integer proficiency, Double yearsOfExperience, String confidence) {
            this.skillName = skillName;
            this.proficiency = proficiency;
            this.yearsOfExperience = yearsOfExperience;
            this.confidence = confidence;
        }

        public String getSkillName() {
            return skillName;
        }

        public void setSkillName(String skillName) {
            this.skillName = skillName;
        }

        public Integer getProficiency() {
            return proficiency;
        }

        public void setProficiency(Integer proficiency) {
            this.proficiency = proficiency;
        }

        public Double getYearsOfExperience() {
            return yearsOfExperience;
        }

        public void setYearsOfExperience(Double yearsOfExperience) {
            this.yearsOfExperience = yearsOfExperience;
        }

        public String getConfidence() {
            return confidence;
        }

        public void setConfidence(String confidence) {
            this.confidence = confidence;
        }
    }

    public static class ExtractedEducation {
        private String degree;
        private String degreeLevel;
        private String fieldOfStudy;
        private String institution;
        private Integer graduationYear;
        private String confidence;

        public ExtractedEducation() {
        }

        public ExtractedEducation(String degree, String degreeLevel, String fieldOfStudy, String institution, Integer graduationYear, String confidence) {
            this.degree = degree;
            this.degreeLevel = degreeLevel;
            this.fieldOfStudy = fieldOfStudy;
            this.institution = institution;
            this.graduationYear = graduationYear;
            this.confidence = confidence;
        }

        public String getDegree() {
            return degree;
        }

        public void setDegree(String degree) {
            this.degree = degree;
        }

        public String getDegreeLevel() {
            return degreeLevel;
        }

        public void setDegreeLevel(String degreeLevel) {
            this.degreeLevel = degreeLevel;
        }

        public String getFieldOfStudy() {
            return fieldOfStudy;
        }

        public void setFieldOfStudy(String fieldOfStudy) {
            this.fieldOfStudy = fieldOfStudy;
        }

        public String getInstitution() {
            return institution;
        }

        public void setInstitution(String institution) {
            this.institution = institution;
        }

        public Integer getGraduationYear() {
            return graduationYear;
        }

        public void setGraduationYear(Integer graduationYear) {
            this.graduationYear = graduationYear;
        }

        public String getConfidence() {
            return confidence;
        }

        public void setConfidence(String confidence) {
            this.confidence = confidence;
        }
    }

    public static class ExtractedExperience {
        private String company;
        private String roleTitle;
        private String startDate;
        private String endDate;
        private boolean isCurrent;
        private String domain;
        private String technologiesUsed;
        private String responsibilitiesSummary;
        private String confidence;

        public ExtractedExperience() {
        }

        public ExtractedExperience(String company, String roleTitle, String startDate, String endDate,
                                   boolean isCurrent, String domain, String technologiesUsed,
                                   String responsibilitiesSummary, String confidence) {
            this.company = company;
            this.roleTitle = roleTitle;
            this.startDate = startDate;
            this.endDate = endDate;
            this.isCurrent = isCurrent;
            this.domain = domain;
            this.technologiesUsed = technologiesUsed;
            this.responsibilitiesSummary = responsibilitiesSummary;
            this.confidence = confidence;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }

        public String getRoleTitle() {
            return roleTitle;
        }

        public void setRoleTitle(String roleTitle) {
            this.roleTitle = roleTitle;
        }

        public String getStartDate() {
            return startDate;
        }

        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }

        public String getEndDate() {
            return endDate;
        }

        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }

        public boolean isCurrent() {
            return isCurrent;
        }

        public void setCurrent(boolean current) {
            isCurrent = current;
        }

        public String getDomain() {
            return domain;
        }

        public void setDomain(String domain) {
            this.domain = domain;
        }

        public String getTechnologiesUsed() {
            return technologiesUsed;
        }

        public void setTechnologiesUsed(String technologiesUsed) {
            this.technologiesUsed = technologiesUsed;
        }

        public String getResponsibilitiesSummary() {
            return responsibilitiesSummary;
        }

        public void setResponsibilitiesSummary(String responsibilitiesSummary) {
            this.responsibilitiesSummary = responsibilitiesSummary;
        }

        public String getConfidence() {
            return confidence;
        }

        public void setConfidence(String confidence) {
            this.confidence = confidence;
        }
    }

    public static class ExtractedCertification {
        private String name;
        private String issuingOrganization;
        private String confidence;

        public ExtractedCertification() {
        }

        public ExtractedCertification(String name, String issuingOrganization, String confidence) {
            this.name = name;
            this.issuingOrganization = issuingOrganization;
            this.confidence = confidence;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getIssuingOrganization() {
            return issuingOrganization;
        }

        public void setIssuingOrganization(String issuingOrganization) {
            this.issuingOrganization = issuingOrganization;
        }

        public String getConfidence() {
            return confidence;
        }

        public void setConfidence(String confidence) {
            this.confidence = confidence;
        }
    }

    public ResumeExtractionPreviewDTO() {
    }

    public ExtractedField<String> getFullName() {
        return fullName;
    }

    public void setFullName(ExtractedField<String> fullName) {
        this.fullName = fullName;
    }

    public ExtractedField<String> getEmail() {
        return email;
    }

    public void setEmail(ExtractedField<String> email) {
        this.email = email;
    }

    public ExtractedField<String> getPhone() {
        return phone;
    }

    public void setPhone(ExtractedField<String> phone) {
        this.phone = phone;
    }

    public ExtractedField<String> getLocation() {
        return location;
    }

    public void setLocation(ExtractedField<String> location) {
        this.location = location;
    }

    public ExtractedField<String> getDesignation() {
        return designation;
    }

    public void setDesignation(ExtractedField<String> designation) {
        this.designation = designation;
    }

    public ExtractedField<String> getSummary() {
        return summary;
    }

    public void setSummary(ExtractedField<String> summary) {
        this.summary = summary;
    }

    public List<ExtractedSkill> getSkills() {
        return skills;
    }

    public void setSkills(List<ExtractedSkill> skills) {
        this.skills = skills;
    }

    public List<ExtractedEducation> getEducation() {
        return education;
    }

    public void setEducation(List<ExtractedEducation> education) {
        this.education = education;
    }

    public List<ExtractedExperience> getExperience() {
        return experience;
    }

    public void setExperience(List<ExtractedExperience> experience) {
        this.experience = experience;
    }

    public List<ExtractedCertification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<ExtractedCertification> certifications) {
        this.certifications = certifications;
    }
}
