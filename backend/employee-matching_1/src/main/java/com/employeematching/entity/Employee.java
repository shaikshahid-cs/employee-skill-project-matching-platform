package com.employeematching.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_profile")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 30)
    private String phone;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String designation;

    @Column(name = "total_experience_years", nullable = false)
    private double totalExperienceYears = 0.0;

    @Column(name = "primary_domain", length = 100)
    private String primaryDomain;

    @Column(length = 100)
    private String department;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Employee() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public double getTotalExperienceYears() {
        return totalExperienceYears;
    }

    public void setTotalExperienceYears(double totalExperienceYears) {
        this.totalExperienceYears = totalExperienceYears;
    }

    // Compatibility getter/setter for experience
    public double getExperience() {
        return totalExperienceYears;
    }

    public void setExperience(double experience) {
        this.totalExperienceYears = experience;
    }

    public String getPrimaryDomain() {
        return primaryDomain;
    }

    public void setPrimaryDomain(String primaryDomain) {
        this.primaryDomain = primaryDomain;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}