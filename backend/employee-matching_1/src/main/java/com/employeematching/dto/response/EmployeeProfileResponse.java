package com.employeematching.dto.response;

public class EmployeeProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String department;
    private String designation;
    private double experience;

    public EmployeeProfileResponse(
            Long id,
            Long userId,
            String name,
            String email,
            String department,
            String designation,
            double experience) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.designation = designation;
        this.experience = experience;
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

    public String getDepartment() {
        return department;
    }

    public String getDesignation() {
        return designation;
    }

    public double getExperience() {
        return experience;
    }
}