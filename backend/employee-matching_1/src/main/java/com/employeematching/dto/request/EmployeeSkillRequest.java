package com.employeematching.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EmployeeSkillRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotNull(message = "Proficiency is required")
    @Min(value = 1, message = "Proficiency must be at least 1")
    @Max(value = 10, message = "Proficiency must be at most 10")
    private Integer proficiency;

    @NotNull(message = "Years of experience is required")
    @Min(value = 0, message = "Years of experience cannot be negative")
    private Double yearsExperience;

    public EmployeeSkillRequest() {
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getProficiency() {
        return proficiency;
    }

    public void setProficiency(Integer proficiency) {
        this.proficiency = proficiency;
    }

    public Double getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Double yearsExperience) {
        this.yearsExperience = yearsExperience;
    }
}