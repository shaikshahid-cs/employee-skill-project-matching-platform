package com.employeematching.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_skill", uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "skill_id"}))
public class EmployeeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private int proficiency; // 1 to 5 scale

    @Column(name = "years_of_experience")
    private Double yearsOfExperience = 0.0;

    @Column(name = "last_used_year")
    private Integer lastUsedYear;

    public EmployeeSkill() {
    }

    public EmployeeSkill(Employee employee, Skill skill, int proficiency) {
        this.employee = employee;
        this.skill = skill;
        this.proficiency = proficiency;
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

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public int getProficiency() {
        return proficiency;
    }

    public void setProficiency(int proficiency) {
        this.proficiency = proficiency;
    }

    public Double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Double yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    // Compatibility getter/setter
    public double getYearsExperience() {
        return yearsOfExperience != null ? yearsOfExperience : 0.0;
    }

    public void setYearsExperience(double yearsExperience) {
        this.yearsOfExperience = yearsExperience;
    }

    public Integer getLastUsedYear() {
        return lastUsedYear;
    }

    public void setLastUsedYear(Integer lastUsedYear) {
        this.lastUsedYear = lastUsedYear;
    }
}