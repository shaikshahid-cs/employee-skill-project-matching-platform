package com.employeematching.dto.response;

public class ManagerProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String department;
    private String designation;

    public ManagerProfileResponse(
            Long id,
            Long userId,
            String name,
            String email,
            String department,
            String designation) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.designation = designation;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getDepartment() {
        return department;
    }

    public String getDesignation() {
        return designation;
    }
}