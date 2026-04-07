package com.freelanceflow.dto;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TimeLogDTO {
    private Double hoursLogged;
    private LocalDate logDate;
    private String notes;
    private Long projectId;
    private Long taskId;

}
