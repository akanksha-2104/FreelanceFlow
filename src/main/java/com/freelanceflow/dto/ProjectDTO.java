package com.freelanceflow.dto;

import com.freelanceflow.entity.enums.ProjectStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProjectDTO {

    private String title;
    private String description;
    private Long clientId;
    private LocalDate startDate;
    private LocalDate deadline;
    private BigDecimal budget;
    private ProjectStatus status;
}
