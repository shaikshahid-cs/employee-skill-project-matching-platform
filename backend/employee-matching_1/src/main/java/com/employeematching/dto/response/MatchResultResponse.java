package com.employeematching.dto.response;

import java.util.List;

public class MatchResultResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeeDesignation;
    private String employeeDepartment;
    private double employeeExperience;
    private List<String> employeeSkills;
    private Long projectId;
    private String projectTitle;

    private double matchScore;
    private boolean mandatoryPassed;

    // Component normalized scores (0.0 to 1.0)
    private double skillsScore;
    private double experienceScore;
    private double roleScore;
    private double educationScore;
    private double certificationScore;
    private double domainScore;

    // Backward compatibility
    private double availabilityScore = 1.0;
    private double preferenceScore = 1.0;

    // Component points earned
    private double skillsPoints;
    private double experiencePoints;
    private double rolePoints;
    private double educationPoints;
    private double certificationPoints;
    private double domainPoints;

    private String matchBreakdownJson;
    private String generatedAt;

    public MatchResultResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public String getEmployeeDesignation() {
        return employeeDesignation;
    }

    public void setEmployeeDesignation(String employeeDesignation) {
        this.employeeDesignation = employeeDesignation;
    }

    public String getEmployeeDepartment() {
        return employeeDepartment;
    }

    public void setEmployeeDepartment(String employeeDepartment) {
        this.employeeDepartment = employeeDepartment;
    }

    public double getEmployeeExperience() {
        return employeeExperience;
    }

    public void setEmployeeExperience(double employeeExperience) {
        this.employeeExperience = employeeExperience;
    }

    public List<String> getEmployeeSkills() {
        return employeeSkills;
    }

    public void setEmployeeSkills(List<String> employeeSkills) {
        this.employeeSkills = employeeSkills;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public boolean isMandatoryPassed() {
        return mandatoryPassed;
    }

    public void setMandatoryPassed(boolean mandatoryPassed) {
        this.mandatoryPassed = mandatoryPassed;
    }

    public double getSkillsScore() {
        return skillsScore;
    }

    public void setSkillsScore(double skillsScore) {
        this.skillsScore = skillsScore;
    }

    public double getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(double experienceScore) {
        this.experienceScore = experienceScore;
    }

    public double getRoleScore() {
        return roleScore;
    }

    public void setRoleScore(double roleScore) {
        this.roleScore = roleScore;
    }

    public double getEducationScore() {
        return educationScore;
    }

    public void setEducationScore(double educationScore) {
        this.educationScore = educationScore;
    }

    public double getCertificationScore() {
        return certificationScore;
    }

    public void setCertificationScore(double certificationScore) {
        this.certificationScore = certificationScore;
    }

    public double getDomainScore() {
        return domainScore;
    }

    public void setDomainScore(double domainScore) {
        this.domainScore = domainScore;
    }

    public double getAvailabilityScore() {
        return availabilityScore;
    }

    public void setAvailabilityScore(double availabilityScore) {
        this.availabilityScore = availabilityScore;
    }

    public double getPreferenceScore() {
        return preferenceScore;
    }

    public void setPreferenceScore(double preferenceScore) {
        this.preferenceScore = preferenceScore;
    }

    public double getSkillsPoints() {
        return skillsPoints;
    }

    public void setSkillsPoints(double skillsPoints) {
        this.skillsPoints = skillsPoints;
    }

    public double getExperiencePoints() {
        return experiencePoints;
    }

    public void setExperiencePoints(double experiencePoints) {
        this.experiencePoints = experiencePoints;
    }

    public double getRolePoints() {
        return rolePoints;
    }

    public void setRolePoints(double rolePoints) {
        this.rolePoints = rolePoints;
    }

    public double getEducationPoints() {
        return educationPoints;
    }

    public void setEducationPoints(double educationPoints) {
        this.educationPoints = educationPoints;
    }

    public double getCertificationPoints() {
        return certificationPoints;
    }

    public void setCertificationPoints(double certificationPoints) {
        this.certificationPoints = certificationPoints;
    }

    public double getDomainPoints() {
        return domainPoints;
    }

    public void setDomainPoints(double domainPoints) {
        this.domainPoints = domainPoints;
    }

    public String getMatchBreakdownJson() {
        return matchBreakdownJson;
    }

    public void setMatchBreakdownJson(String matchBreakdownJson) {
        this.matchBreakdownJson = matchBreakdownJson;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }
}
