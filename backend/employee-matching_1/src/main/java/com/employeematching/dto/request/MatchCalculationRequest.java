package com.employeematching.dto.request;

import jakarta.validation.constraints.NotNull;

public class MatchCalculationRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    public MatchCalculationRequest() {
    }

    public MatchCalculationRequest(Long employeeId, Long projectId) {
        this.employeeId = employeeId;
        this.projectId = projectId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
