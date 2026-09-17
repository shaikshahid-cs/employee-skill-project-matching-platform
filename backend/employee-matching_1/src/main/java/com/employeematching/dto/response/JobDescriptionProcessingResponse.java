package com.employeematching.dto.response;

import java.util.List;

public class JobDescriptionProcessingResponse {

    private Long projectId;
    private String status;
    private List<SkillResponse> detectedSkills;

    public JobDescriptionProcessingResponse() {
    }

    public JobDescriptionProcessingResponse(
            Long projectId,
            String status,
            List<SkillResponse> detectedSkills) {

        this.projectId = projectId;
        this.status = status;
        this.detectedSkills = detectedSkills;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<SkillResponse> getDetectedSkills() {
        return detectedSkills;
    }

    public void setDetectedSkills(
            List<SkillResponse> detectedSkills) {

        this.detectedSkills = detectedSkills;
    }
}