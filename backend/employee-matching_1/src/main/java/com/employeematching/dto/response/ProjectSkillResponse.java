package com.employeematching.dto.response;

public class ProjectSkillResponse {

    private Long id;
    private Long projectId;
    private Long skillId;
    private String skillName;
    private int requiredProficiency;
    private int importance;
    private boolean isMandatory;

    public ProjectSkillResponse() {
    }

    public ProjectSkillResponse(
            Long id,
            Long projectId,
            Long skillId,
            String skillName,
            int requiredProficiency,
            int importance,
            boolean isMandatory) {
        this.id = id;
        this.projectId = projectId;
        this.skillId = skillId;
        this.skillName = skillName;
        this.requiredProficiency = requiredProficiency;
        this.importance = importance;
        this.isMandatory = isMandatory;
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public Long getSkillId() {
        return skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public int getRequiredProficiency() {
        return requiredProficiency;
    }

    public int getMinProficiency() {
        return requiredProficiency;
    }

    public int getImportance() {
        return importance;
    }

    public boolean isMandatory() {
        return isMandatory;
    }
}