package com.employeematching.dto.response;

public class EducationResponse {

    private Long id;
    private Long employeeId;
    private String degree;
    private String field;
    private String institution;
    private Integer graduationYear;

    public EducationResponse(
            Long id,
            Long employeeId,
            String degree,
            String field,
            String institution,
            Integer graduationYear) {

        this.id = id;
        this.employeeId = employeeId;
        this.degree = degree;
        this.field = field;
        this.institution = institution;
        this.graduationYear = graduationYear;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getDegree() {
        return degree;
    }

    public String getField() {
        return field;
    }

    public String getInstitution() {
        return institution;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }
}