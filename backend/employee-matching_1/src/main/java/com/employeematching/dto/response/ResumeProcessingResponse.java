package com.employeematching.dto.response;

import java.util.List;

public class ResumeProcessingResponse {

    private Long resumeId;
    private String processingStatus;
    private List<SkillResponse> detectedSkills;

    public ResumeProcessingResponse() {
    }

    public ResumeProcessingResponse(Long resumeId, String processingStatus, List<SkillResponse> detectedSkills) {
        this.resumeId = resumeId;
        this.processingStatus = processingStatus;
        this.detectedSkills = detectedSkills;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getProcessingStatus() {
        return processingStatus;
    }

    public void setProcessingStatus(String processingStatus) {
        this.processingStatus = processingStatus;
    }

    public List<SkillResponse> getDetectedSkills() {
        return detectedSkills;
    }

    public void setDetectedSkills(List<SkillResponse> detectedSkills) {
        this.detectedSkills = detectedSkills;
    }
}
