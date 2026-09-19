package com.employeematching.dto.response;

public class ExperienceResponse {

    private Long id;
    private Long employeeId;
    private String company;
    private String roleTitle;
    private String startDate;
    private String endDate;
    private boolean isCurrent;
    private String domain;
    private String technologiesUsed;
    private String responsibilitiesSummary;

    public ExperienceResponse() {
    }

    public ExperienceResponse(Long id, Long employeeId, String company, String roleTitle,
                              String startDate, String endDate, boolean isCurrent,
                              String domain, String technologiesUsed, String responsibilitiesSummary) {
        this.id = id;
        this.employeeId = employeeId;
        this.company = company;
        this.roleTitle = roleTitle;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isCurrent = isCurrent;
        this.domain = domain;
        this.technologiesUsed = technologiesUsed;
        this.responsibilitiesSummary = responsibilitiesSummary;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
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
}
