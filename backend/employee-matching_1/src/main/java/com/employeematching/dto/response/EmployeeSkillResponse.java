package com.employeematching.dto.response;

public class EmployeeSkillResponse {

    private Long id;
    private Long skillId;
    private String skillName;
    private int proficiency;
    private double yearsExperience;

    public EmployeeSkillResponse(
            Long id,
            Long skillId,
            String skillName,
            int proficiency,
            double yearsExperience) {

        this.id = id;
        this.skillId = skillId;
        this.skillName = skillName;
        this.proficiency = proficiency;
        this.yearsExperience = yearsExperience;
    }

    public Long getId() {
        return id;
    }

    public Long getSkillId() {
        return skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public int getProficiency() {
        return proficiency;
    }

    public double getYearsExperience() {
        return yearsExperience;
    }
}