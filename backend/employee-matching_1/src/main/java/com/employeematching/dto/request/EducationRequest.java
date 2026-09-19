package com.employeematching.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class EducationRequest {

    @NotBlank(message = "Degree is required")
    private String degree;

    private String degreeLevel; // BACHELOR, MASTER, DOCTORATE, DIPLOMA

    @NotBlank(message = "Field of study is required")
    private String fieldOfStudy;

    @NotBlank(message = "Institution is required")
    private String institution;

    private Integer startYear;

    @NotNull(message = "Graduation year is required")
    @Min(value = 1900, message = "Invalid graduation year")
    @Max(value = 2100, message = "Invalid graduation year")
    private Integer graduationYear;

    private String gradeGpa;

    public EducationRequest() {
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getDegreeLevel() {
        return degreeLevel;
    }

    public void setDegreeLevel(String degreeLevel) {
        this.degreeLevel = degreeLevel;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    // Compatibility getter/setter
    public String getField() {
        return fieldOfStudy;
    }

    public void setField(String field) {
        this.fieldOfStudy = field;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getGradeGpa() {
        return gradeGpa;
    }

    public void setGradeGpa(String gradeGpa) {
        this.gradeGpa = gradeGpa;
    }
}