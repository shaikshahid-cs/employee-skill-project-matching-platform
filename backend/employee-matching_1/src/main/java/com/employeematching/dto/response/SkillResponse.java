package com.employeematching.dto.response;

public class SkillResponse {

    private Long id;
    private String name;

    public SkillResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}