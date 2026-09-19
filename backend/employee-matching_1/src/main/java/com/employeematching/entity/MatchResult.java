package com.employeematching.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "match_result", uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "project_id"}))
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "match_score", nullable = false)
    private double matchScore; // 0.00 to 100.00

    @Column(name = "mandatory_passed", nullable = false)
    private boolean mandatoryPassed = true;

    @Column(name = "skills_score", nullable = false)
    private double skillsScore;

    @Column(name = "experience_score", nullable = false)
    private double experienceScore;

    @Column(name = "role_score", nullable = false)
    private double roleScore;

    @Column(name = "education_score", nullable = false)
    private double educationScore;

    @Column(name = "certification_score", nullable = false)
    private double certificationScore;

    @Column(name = "domain_score", nullable = false)
    private double domainScore;

    // Backward compatibility fields
    @Column(name = "availability_score")
    private double availabilityScore = 1.0;

    @Column(name = "preference_score")
    private double preferenceScore = 1.0;

    @Column(name = "match_breakdown_json", columnDefinition = "LONGTEXT")
    private String matchBreakdownJson;

    @Column(name = "generated_at")
    private String generatedAt;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;

    public MatchResult() {
    }

    @PrePersist
    @PreUpdate
    protected void onPersist() {
        calculatedAt = LocalDateTime.now();
        if (generatedAt == null) {
            generatedAt = LocalDateTime.now().toString();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
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

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}