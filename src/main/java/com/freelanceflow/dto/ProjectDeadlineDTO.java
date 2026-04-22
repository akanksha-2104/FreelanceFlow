package com.freelanceflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDeadlineDTO {

    private Long projectId;
    private String title;
    private String clientName; // 🔥 make sure this exists in Project OR map correctly
    private LocalDate deadline;
}