package com.employeematching.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ApplicationReviewRequest {

    @NotBlank
    private String status;

    public ApplicationReviewRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}