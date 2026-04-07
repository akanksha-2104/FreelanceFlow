package com.freelanceflow.dto;

import lombok.Data;

@Data
public class ProjectTimeDTO {
    private Long projectId;
    private String projectTitle;
    Double totalHours;
}
