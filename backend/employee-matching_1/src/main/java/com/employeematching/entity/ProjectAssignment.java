package com.employeematching.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_assignment", uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "employee_id"}))
public class ProjectAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_manager_id", nullable = false)
    private Manager assignedByManager;

    @Column(name = "assigned_role", length = 100)
    private String assignedRole;

    @Column(name = "assignment_date", nullable = false)
    private LocalDateTime assignmentDate;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, REMOVED

    public ProjectAssignment() {
    }

    @PrePersist
    protected void onCreate() {
        if (assignmentDate == null) {
            assignmentDate = LocalDateTime.now();
        }
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Manager getAssignedByManager() {
        return assignedByManager;
    }

    public void setAssignedByManager(Manager assignedByManager) {
        this.assignedByManager = assignedByManager;
    }

    public String getAssignedRole() {
        return assignedRole;
    }

    public void setAssignedRole(String assignedRole) {
        this.assignedRole = assignedRole;
    }

    public LocalDateTime getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(LocalDateTime assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
