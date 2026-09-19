package com.employeematching.dto.response;

import java.time.LocalDate;

public class EmployeeProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private LocalDate dateOfBirth;
    private String phone;
    private String location;
    private String department;
    private String designation;
    private double totalExperienceYears;
    private String primaryDomain;
    private String summary;
    private int skillsCount;
    private int educationCount;
    private int certificationsCount;
    private int experienceCount;

    public EmployeeProfileResponse() {
    }

    public EmployeeProfileResponse(
            Long id,
            Long userId,
            String name,
            String email,
            LocalDate dateOfBirth,
            String phone,
            String location,
            String department,
            String designation,
            double totalExperienceYears,
            String primaryDomain,
            String summary,
            int skillsCount,
            int educationCount,
            int certificationsCount,
            int experienceCount) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.location = location;
        this.department = department;
        this.designation = designation;
        this.totalExperienceYears = totalExperienceYears;
        this.primaryDomain = primaryDomain;
        this.summary = summary;
        this.skillsCount = skillsCount;
        this.educationCount = educationCount;
        this.certificationsCount = certificationsCount;
        this.experienceCount = experienceCount;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getDepartment() {
        return department;
    }

    public String getDesignation() {
        return designation;
    }

    public double getTotalExperienceYears() {
        return totalExperienceYears;
    }

    // Compatibility getter
    public double getExperience() {
        return totalExperienceYears;
    }

    public String getPrimaryDomain() {
        return primaryDomain;
    }

    public String getSummary() {
        return summary;
    }

    public int getSkillsCount() {
        return skillsCount;
    }

    public int getEducationCount() {
        return educationCount;
    }

    public int getCertificationsCount() {
        return certificationsCount;
    }

    public int getExperienceCount() {
        return experienceCount;
    }
}