package com.employeematching.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class EducationRequest {

    @NotBlank(message = "Degree is required")
    private String degree;

    @NotBlank(message = "Field is required")
    private String field;

    @NotBlank(message = "Institution is required")
    private String institution;

    @NotNull(message = "Graduation year is required")
    @Min(value = 1900, message = "Invalid graduation year")
    @Max(value = 2100, message = "Invalid graduation year")
    private Integer graduationYear;

    public EducationRequest() {
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }
}