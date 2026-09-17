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
    private double skillsScore;
    private double experienceScore;
    private double certificationScore;
    private double availabilityScore;
    private double preferenceScore;
    private String generatedAt;

    public MatchResultResponse() {
    }

    public MatchResultResponse(
            Long id,
            Long employeeId,
            String employeeName,
            String employeeEmail,
            String employeeDesignation,
            String employeeDepartment,
            double employeeExperience,
            List<String> employeeSkills,
            Long projectId,
            String projectTitle,
            double matchScore,
            double skillsScore,
            double experienceScore,
            double certificationScore,
            double availabilityScore,
            double preferenceScore,
            String generatedAt) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.employeeDesignation = employeeDesignation;
        this.employeeDepartment = employeeDepartment;
        this.employeeExperience = employeeExperience;
        this.employeeSkills = employeeSkills;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.matchScore = matchScore;
        this.skillsScore = skillsScore;
        this.experienceScore = experienceScore;
        this.certificationScore = certificationScore;
        this.availabilityScore = availabilityScore;
        this.preferenceScore = preferenceScore;
        this.generatedAt = generatedAt;
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

    public double getCertificationScore() {
        return certificationScore;
    }

    public void setCertificationScore(double certificationScore) {
        this.certificationScore = certificationScore;
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

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }
}
