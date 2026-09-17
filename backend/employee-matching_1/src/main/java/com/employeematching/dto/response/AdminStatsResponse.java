package com.employeematching.dto.response;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalEmployees;
    private long totalManagers;
    private long totalProjects;
    private long openProjects;
    private long totalApplications;
    private long totalSkills;
    private long totalMatchResults;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(
            long totalUsers,
            long totalEmployees,
            long totalManagers,
            long totalProjects,
            long openProjects,
            long totalApplications,
            long totalSkills,
            long totalMatchResults) {
        this.totalUsers = totalUsers;
        this.totalEmployees = totalEmployees;
        this.totalManagers = totalManagers;
        this.totalProjects = totalProjects;
        this.openProjects = openProjects;
        this.totalApplications = totalApplications;
        this.totalSkills = totalSkills;
        this.totalMatchResults = totalMatchResults;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalManagers() {
        return totalManagers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getOpenProjects() {
        return openProjects;
    }

    public void setOpenProjects(long openProjects) {
        this.openProjects = openProjects;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(long totalSkills) {
        this.totalSkills = totalSkills;
    }

    public long getTotalMatchResults() {
        return totalMatchResults;
    }

    public void setTotalMatchResults(long totalMatchResults) {
        this.totalMatchResults = totalMatchResults;
    }
}
