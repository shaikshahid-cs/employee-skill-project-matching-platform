package com.employeematching.dto.response;

public class JobDescriptionResponse {

    private Long id;
    private Long projectId;
    private String fileName;
    private String processingStatus;
    private String uploadedAt;

    public JobDescriptionResponse(
            Long id,
            Long projectId,
            String fileName,
            String processingStatus,
            String uploadedAt) {

        this.id = id;
        this.projectId = projectId;
        this.fileName = fileName;
        this.processingStatus = processingStatus;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getProcessingStatus() {
        return processingStatus;
    }

    public String getUploadedAt() {
        return uploadedAt;
    }
}