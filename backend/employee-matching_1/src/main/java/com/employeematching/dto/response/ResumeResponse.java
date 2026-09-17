package com.employeematching.dto.response;

public class ResumeResponse {

    private Long id;
    private Long employeeId;
    private String fileName;
    private String processingStatus;
    private String uploadedAt;

    public ResumeResponse(
            Long id,
            Long employeeId,
            String fileName,
            String processingStatus,
            String uploadedAt) {

        this.id = id;
        this.employeeId = employeeId;
        this.fileName = fileName;
        this.processingStatus = processingStatus;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
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