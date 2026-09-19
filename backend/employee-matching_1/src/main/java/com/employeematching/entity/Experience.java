package com.employeematching.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "experience")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(name = "role_title", nullable = false, length = 150)
    private String roleTitle;

    @Column(name = "start_date", nullable = false, length = 30)
    private String startDate;

    @Column(name = "end_date", length = 30)
    private String endDate;

    @Column(name = "is_current", nullable = false)
    private boolean isCurrent = false;

    @Column(length = 100)
    private String domain;

    @Column(name = "technologies_used", length = 500)
    private String technologiesUsed;

    @Column(name = "responsibilities_summary", columnDefinition = "TEXT")
    private String responsibilitiesSummary;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Experience() {
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public boolean isCurrent() {
        return isCurrent;
    }

    public void setCurrent(boolean current) {
        isCurrent = current;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getTechnologiesUsed() {
        return technologiesUsed;
    }

    public void setTechnologiesUsed(String technologiesUsed) {
        this.technologiesUsed = technologiesUsed;
    }

    public String getResponsibilitiesSummary() {
        return responsibilitiesSummary;
    }

    public void setResponsibilitiesSummary(String responsibilitiesSummary) {
        this.responsibilitiesSummary = responsibilitiesSummary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
