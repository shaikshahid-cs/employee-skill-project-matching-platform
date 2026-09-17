package com.employeematching.dto.request;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequest {

    @NotNull
    private Long projectId;

    public ApplicationRequest() {
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}