package com.freelanceflow.controller;

import com.freelanceflow.dto.TaskDTO;
import com.freelanceflow.dto.TaskResponseDTO;
import com.freelanceflow.entity.enums.TaskStatus;
import com.freelanceflow.services.ProjectService;
import com.freelanceflow.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskDTO dto) {
        TaskResponseDTO response = taskService.createTask(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByProject(@PathVariable Long projectId) {
        List<TaskResponseDTO> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskDTO dto) {

        TaskResponseDTO response = taskService.updateTask(taskId, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status) {

        TaskResponseDTO response = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

}
