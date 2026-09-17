package com.employeematching.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_skill", uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "skill_id"}))
public class ProjectSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    private int requiredProficiency;
    private int importance;

    public ProjectSkill() {
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

    public int getRequiredProficiency() {
        return requiredProficiency;
    }

    public void setRequiredProficiency(int requiredProficiency) {
        this.requiredProficiency = requiredProficiency;
    }

    public int getImportance() {
        return importance;
    }

    public void setImportance(int importance) {
        this.importance = importance;
    }
}