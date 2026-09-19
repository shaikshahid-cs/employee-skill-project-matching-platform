package com.employeematching.dto.request;

import java.time.LocalDate;

public class EmployeeProfileRequest {

    private String fullName;
    private LocalDate dateOfBirth;
    private String phone;
    private String location;
    private String designation;
    private Double totalExperienceYears = 0.0;
    private String primaryDomain;
    private String department;
    private String summary;

    public EmployeeProfileRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Double getTotalExperienceYears() {
        return totalExperienceYears;
    }

    public void setTotalExperienceYears(Double totalExperienceYears) {
        this.totalExperienceYears = totalExperienceYears;
    }

    // Compatibility getter/setter
    public Double getExperience() {
        return totalExperienceYears != null ? totalExperienceYears : 0.0;
    }

    public void setExperience(Double experience) {
        this.totalExperienceYears = experience;
    }

    public String getPrimaryDomain() {
        return primaryDomain;
    }

    public void setPrimaryDomain(String primaryDomain) {
        this.primaryDomain = primaryDomain;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}