package com.employeematching.dto.response;

import java.util.List;

public class MatchExplanationResponse {

    private Long matchResultId;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeeDesignation;
    private String employeeDepartment;
    private Long projectId;
    private String projectTitle;
    private double overallMatchScore;

    // Component Scores (0.0 to 1.0)
    private double skillsScore;
    private double experienceScore;
    private double certificationScore;
    private double availabilityScore;
    private double preferenceScore;

    // Component Points out of Weight Max (50, 30, 10, 5, 5)
    private double skillsPoints;
    private double experiencePoints;
    private double certificationPoints;
    private double availabilityPoints;
    private double preferencePoints;

    // Detailed Skill Breakdown
    private List<String> matchedSkills;
    private List<String> missingSkills;

    private String generatedAt;

    public MatchExplanationResponse() {
    }

    public MatchExplanationResponse(
            Long matchResultId,
            Long employeeId,
            String employeeName,
            String employeeEmail,
            String employeeDesignation,
            String employeeDepartment,
            Long projectId,
            String projectTitle,
            double overallMatchScore,
            double skillsScore,
            double experienceScore,
            double certificationScore,
            double availabilityScore,
            double preferenceScore,
            double skillsPoints,
            double experiencePoints,
            double certificationPoints,
            double availabilityPoints,
            double preferencePoints,
            List<String> matchedSkills,
            List<String> missingSkills,
            String generatedAt) {

        this.matchResultId = matchResultId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.employeeDesignation = employeeDesignation;
        this.employeeDepartment = employeeDepartment;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.overallMatchScore = overallMatchScore;
        this.skillsScore = skillsScore;
        this.experienceScore = experienceScore;
        this.certificationScore = certificationScore;
        this.availabilityScore = availabilityScore;
        this.preferenceScore = preferenceScore;
        this.skillsPoints = skillsPoints;
        this.experiencePoints = experiencePoints;
        this.certificationPoints = certificationPoints;
        this.availabilityPoints = availabilityPoints;
        this.preferencePoints = preferencePoints;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.generatedAt = generatedAt;
    }

    public Long getMatchResultId() {
        return matchResultId;
    }

    public void setMatchResultId(Long matchResultId) {
        this.matchResultId = matchResultId;
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

    public double getOverallMatchScore() {
        return overallMatchScore;
    }

    public void setOverallMatchScore(double overallMatchScore) {
        this.overallMatchScore = overallMatchScore;
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

    public double getCertificationPoints() {
        return certificationPoints;
    }

    public void setCertificationPoints(double certificationPoints) {
        this.certificationPoints = certificationPoints;
    }

    public double getAvailabilityPoints() {
        return availabilityPoints;
    }

    public void setAvailabilityPoints(double availabilityPoints) {
        this.availabilityPoints = availabilityPoints;
    }

    public double getPreferencePoints() {
        return preferencePoints;
    }

    public void setPreferencePoints(double preferencePoints) {
        this.preferencePoints = preferencePoints;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }
}
