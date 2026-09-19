package com.employeematching.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "skill_alias")
public class SkillAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String alias;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    public SkillAlias() {
    }

    public SkillAlias(String alias, Skill skill) {
        this.alias = alias;
        this.skill = skill;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }
}
