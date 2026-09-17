package com.employeematching.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ManagerProfileRequest {

    @NotBlank
    private String department;

    @NotBlank
    private String designation;

    public ManagerProfileRequest() {
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}