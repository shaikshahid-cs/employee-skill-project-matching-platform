package com.employeematching.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ExperienceRequest {

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Role / job title is required")
    private String roleTitle;

    @NotBlank(message = "Start date is required")
    private String startDate;

    private String endDate;
    private boolean isCurrent = false;
    private String domain;
    private String technologiesUsed;
    private String responsibilitiesSummary;

    public ExperienceRequest() {
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
        this.isCurrent = current;
    }

    public void setIsCurrent(boolean isCurrent) {
        this.isCurrent = isCurrent;
    }

    public void setJobTitle(String jobTitle) {
        if (this.roleTitle == null) {
            this.roleTitle = jobTitle;
        }
    }

    public void setResponsibilities(String responsibilities) {
        if (this.responsibilitiesSummary == null) {
            this.responsibilitiesSummary = responsibilities;
        }
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
