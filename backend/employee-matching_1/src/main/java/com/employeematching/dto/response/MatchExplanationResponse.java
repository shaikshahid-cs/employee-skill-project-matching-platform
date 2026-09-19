package com.employeematching.dto.response;

import java.util.ArrayList;
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
    private boolean mandatoryPassed = true;
    private List<String> failedMandatoryReasons = new ArrayList<>();

    // Component Scores (0.0 to 1.0)
    private double skillsScore;
    private double experienceScore;
    private double roleScore;
    private double educationScore;
    private double certificationScore;
    private double domainScore;

    // Component Points out of Weight Max (35, 20, 15, 12, 10, 8)
    private double skillsPoints;
    private double experiencePoints;
    private double rolePoints;
    private double educationPoints;
    private double certificationPoints;
    private double domainPoints;

    // Backward compatibility fields
    private double availabilityScore = 1.0;
    private double preferenceScore = 1.0;
    private double availabilityPoints = 0.0;
    private double preferencePoints = 0.0;

    // Detailed Skill Breakdown
    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();

    // Qualitative Explanation
    private List<String> strengths = new ArrayList<>();
    private List<String> missingOrGaps = new ArrayList<>();

    private String matchBreakdownJson;
    private String generatedAt;

    public MatchExplanationResponse() {
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

    public boolean isMandatoryPassed() {
        return mandatoryPassed;
    }

    public void setMandatoryPassed(boolean mandatoryPassed) {
        this.mandatoryPassed = mandatoryPassed;
    }

    public List<String> getFailedMandatoryReasons() {
        return failedMandatoryReasons;
    }

    public void setFailedMandatoryReasons(List<String> failedMandatoryReasons) {
        this.failedMandatoryReasons = failedMandatoryReasons;
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

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getMissingOrGaps() {
        return missingOrGaps;
    }

    public void setMissingOrGaps(List<String> missingOrGaps) {
        this.missingOrGaps = missingOrGaps;
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
