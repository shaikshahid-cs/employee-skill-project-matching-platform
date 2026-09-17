package com.employeematching.dto.response;

import java.util.List;

public class ApplicationResponse {

    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeeDesignation;
    private String employeeDepartment;
    private double employeeExperience;
    private List<String> employeeSkills;
    private String status;
    private String appliedAt;
    private String updatedAt;

    public ApplicationResponse() {
    }

    public ApplicationResponse(
            Long id,
            Long projectId,
            String projectTitle,
            Long employeeId,
            String employeeName,
            String employeeEmail,
            String employeeDesignation,
            String employeeDepartment,
            double employeeExperience,
            List<String> employeeSkills,
            String status,
            String appliedAt,
            String updatedAt) {

        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.employeeDesignation = employeeDesignation;
        this.employeeDepartment = employeeDepartment;
        this.employeeExperience = employeeExperience;
        this.employeeSkills = employeeSkills;
        this.status = status;
        this.appliedAt = appliedAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(String appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}