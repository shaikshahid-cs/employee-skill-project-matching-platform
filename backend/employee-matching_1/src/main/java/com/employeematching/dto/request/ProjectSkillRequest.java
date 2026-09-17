package com.employeematching.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProjectSkillRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotNull(message = "Required proficiency is required")
    @Min(value = 1, message = "Required proficiency must be at least 1")
    @Max(value = 5, message = "Required proficiency must be at most 5")
    private Integer requiredProficiency;

    @NotNull(message = "Importance is required")
    @Min(value = 1, message = "Importance must be at least 1")
    @Max(value = 5, message = "Importance must be at most 5")
    private Integer importance;

    public ProjectSkillRequest() {
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getRequiredProficiency() {
        return requiredProficiency;
    }

    public void setRequiredProficiency(Integer requiredProficiency) {
        this.requiredProficiency = requiredProficiency;
    }

    public Integer getImportance() {
        return importance;
    }

    public void setImportance(Integer importance) {
        this.importance = importance;
    }
}