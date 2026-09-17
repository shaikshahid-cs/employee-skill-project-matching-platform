package com.employeematching.dto.response;

import com.employeematching.entity.User;

public class RegisterResponse {

    private Long id;
    private String name;
    private String email;
    private User.Role role;

    public RegisterResponse() {
    }

    public RegisterResponse(Long id, String name, String email, User.Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public User.Role getRole() {
        return role;
    }
}