package com.employeematching.dto.response;

public class ProjectAssignmentResponse {

    private Long id;
    private Long projectId;
    private String projectTitle;
    private String projectStatus;
    private String managerName;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeeDesignation;
    private String assignedRole;
    private String assignmentDate;
    private String status;

    public ProjectAssignmentResponse() {
    }

    public ProjectAssignmentResponse(
            Long id,
            Long projectId,
            String projectTitle,
            String projectStatus,
            String managerName,
            Long employeeId,
            String employeeName,
            String employeeEmail,
            String employeeDesignation,
            String assignedRole,
            String assignmentDate,
            String status) {
        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.projectStatus = projectStatus;
        this.managerName = managerName;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.employeeDesignation = employeeDesignation;
        this.assignedRole = assignedRole;
        this.assignmentDate = assignmentDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public String getManagerName() {
        return managerName;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public String getEmployeeDesignation() {
        return employeeDesignation;
    }

    public String getAssignedRole() {
        return assignedRole;
    }

    public String getAssignmentDate() {
        return assignmentDate;
    }

    public String getStatus() {
        return status;
    }
}
