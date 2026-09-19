package com.employeematching.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_skill_req", uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "skill_id"}))
public class ProjectSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "min_proficiency", nullable = false)
    private int minProficiency = 1; // 1 to 5 scale

    @Column(nullable = false)
    private int importance = 3; // 1 (Low) to 5 (Critical)

    @Column(name = "is_mandatory", nullable = false)
    private boolean isMandatory = false;

    public ProjectSkill() {
    }

    public ProjectSkill(Project project, Skill skill, int minProficiency, int importance, boolean isMandatory) {
        this.project = project;
        this.skill = skill;
        this.minProficiency = minProficiency;
        this.importance = importance;
        this.isMandatory = isMandatory;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public int getMinProficiency() {
        return minProficiency;
    }

    public void setMinProficiency(int minProficiency) {
        this.minProficiency = minProficiency;
    }

    // Compatibility getter/setter
    public int getRequiredProficiency() {
        return minProficiency;
    }

    public void setRequiredProficiency(int requiredProficiency) {
        this.minProficiency = requiredProficiency;
    }

    public int getImportance() {
        return importance;
    }

    public void setImportance(int importance) {
        this.importance = importance;
    }

    public boolean isMandatory() {
        return isMandatory;
    }

    public void setMandatory(boolean mandatory) {
        isMandatory = mandatory;
    }
}