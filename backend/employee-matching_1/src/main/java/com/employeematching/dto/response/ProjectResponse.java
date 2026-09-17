package com.employeematching.dto.response;

public class ProjectResponse {

    private Long id;
    private Long managerId;
    private String title;
    private String description;
    private String department;
    private String location;
    private double experienceRequired;
    private String status;

    public ProjectResponse(
            Long id,
            Long managerId,
            String title,
            String description,
            String department,
            String location,
            double experienceRequired,
            String status) {

        this.id = id;
        this.managerId = managerId;
        this.title = title;
        this.description = description;
        this.department = department;
        this.location = location;
        this.experienceRequired = experienceRequired;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getManagerId() {
        return managerId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDepartment() {
        return department;
    }

    public String getLocation() {
        return location;
    }

    public double getExperienceRequired() {
        return experienceRequired;
    }

    public String getStatus() {
        return status;
    }
}