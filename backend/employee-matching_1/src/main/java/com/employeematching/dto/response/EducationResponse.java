package com.employeematching.dto.response;

public class EducationResponse {

    private Long id;
    private String degree;
    private String degreeLevel;
    private String field;
    private String fieldOfStudy;
    private String institution;
    private Integer startYear;
    private int graduationYear;
    private String gradeGpa;

    public EducationResponse() {
    }

    public EducationResponse(
            Long id,
            String degree,
            String degreeLevel,
            String fieldOfStudy,
            String institution,
            Integer startYear,
            int graduationYear,
            String gradeGpa) {
        this.id = id;
        this.degree = degree;
        this.degreeLevel = degreeLevel;
        this.field = fieldOfStudy;
        this.fieldOfStudy = fieldOfStudy;
        this.institution = institution;
        this.startYear = startYear;
        this.graduationYear = graduationYear;
        this.gradeGpa = gradeGpa;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
        this.fieldOfStudy = field;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
        this.field = fieldOfStudy;
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

    public int getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(int graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getGradeGpa() {
        return gradeGpa;
    }

    public void setGradeGpa(String gradeGpa) {
        this.gradeGpa = gradeGpa;
    }
}