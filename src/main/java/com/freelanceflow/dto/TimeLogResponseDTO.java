package com.freelanceflow.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TimeLogResponseDTO {
    private Long logId;
    Double hoursLogged;
    LocalDate logDate;
    String notes;
    LocalDateTime createdAt;
    Long projectId;
    String projectTitle;
    Long taskId;
    String taskTitle;
}
