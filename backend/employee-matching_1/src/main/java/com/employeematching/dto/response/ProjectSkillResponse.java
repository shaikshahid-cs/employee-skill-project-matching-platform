package com.employeematching.dto.response;

public class ProjectSkillResponse {

    private Long id;
    private Long projectId;
    private Long skillId;
    private String skillName;
    private int requiredProficiency;
    private int importance;

    public ProjectSkillResponse(
            Long id,
            Long projectId,
            Long skillId,
            String skillName,
            int requiredProficiency,
            int importance) {

        this.id = id;
        this.projectId = projectId;
        this.skillId = skillId;
        this.skillName = skillName;
        this.requiredProficiency = requiredProficiency;
        this.importance = importance;
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

    public int getImportance() {
        return importance;
    }
}