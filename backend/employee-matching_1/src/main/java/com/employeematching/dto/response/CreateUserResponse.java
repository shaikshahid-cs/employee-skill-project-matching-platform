package com.employeematching.dto.response;

import com.employeematching.entity.User;

public class CreateUserResponse {

    private Long id;
    private String email;
    private String fullName;
    private User.Role role;
    private String temporaryPassword;
    private boolean isActive;
    private boolean mustChangePassword;

    public CreateUserResponse() {
    }

    public CreateUserResponse(Long id, String email, String fullName, User.Role role,
                              String temporaryPassword, boolean isActive, boolean mustChangePassword) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.temporaryPassword = temporaryPassword;
        this.isActive = isActive;
        this.mustChangePassword = mustChangePassword;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }

    public void setMustChangePassword(boolean mustChangePassword) {
        this.mustChangePassword = mustChangePassword;
    }
}
