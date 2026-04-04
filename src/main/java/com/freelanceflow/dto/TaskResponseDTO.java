package com.freelanceflow.dto;

import com.freelanceflow.entity.enums.Priority;
import com.freelanceflow.entity.enums.ProjectStatus;
import com.freelanceflow.entity.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskResponseDTO {
    private Long taskId;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    private Long projectId;
    private String projectTitle;
}
