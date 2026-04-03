package com.freelanceflow.dto;

import com.freelanceflow.entity.enums.ProjectStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProjectResponseDTO {
    private Long projectId;
    private String title;
    private String description;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate deadline;
    private BigDecimal budget;
    private LocalDateTime createdAt;
    private Long clientId;
    private String clientName;
}
