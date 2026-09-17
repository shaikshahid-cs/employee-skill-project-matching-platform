package com.employeematching.dto.response;

import com.employeematching.entity.User;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private User.Role role;

    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email, User.Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }
}
