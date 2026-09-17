package com.employeematching.dto.response;

public class ApplicationReviewResponse {

    private Long id;
    private Long projectId;
    private Long employeeId;
    private String status;

    public ApplicationReviewResponse(
            Long id,
            Long projectId,
            Long employeeId,
            String status) {

        this.id = id;
        this.projectId = projectId;
        this.employeeId = employeeId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getStatus() {
        return status;
    }
}