package com.freelanceflow.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TaskDTO {
    private String title;
    private String description;
    private LocalDate dueDate;

    private Long projectId;
}
