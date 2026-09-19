package com.employeematching.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 100)
    private String degree;

    @Column(name = "degree_level", length = 50)
    private String degreeLevel; // BACHELOR, MASTER, DOCTORATE, DIPLOMA

    @Column(name = "field_of_study", nullable = false, length = 150)
    private String fieldOfStudy;

    @Column(nullable = false, length = 200)
    private String institution;

    @Column(name = "start_year")
    private int startYear;

    @Column(name = "graduation_year")
    private int graduationYear;

    @Column(name = "grade_gpa", length = 20)
    private String gradeGpa;

    public Education() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
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

    public int getStartYear() {
        return startYear;
    }

    public void setStartYear(int startYear) {
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