package com.freelanceflow.controller;

import com.freelanceflow.dto.ProjectTimeDTO;
import com.freelanceflow.dto.TimeLogDTO;
import com.freelanceflow.dto.TimeLogResponseDTO;
import com.freelanceflow.services.TimeLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-logs")
@RequiredArgsConstructor
public class TimeLogController {

    @Autowired
    private TimeLogService timeLogService;

    //Add Time Log
    @PostMapping
    public TimeLogResponseDTO addLog(@RequestBody TimeLogDTO dto) {
        return timeLogService.addLog(dto);
    }

    //Get Logs by Project
    @GetMapping("/project/{projectId}")
    public List<TimeLogResponseDTO> getLogsByProject(@PathVariable Long projectId) {
        return timeLogService.getLogsByProject(projectId);
    }

    // Get Total Hours for Project
    @GetMapping("/project/{projectId}/total")
    public ProjectTimeDTO getTotalHours(@PathVariable Long projectId) {
        return timeLogService.getTotalHours(projectId);
    }

    // Delete Time Log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        timeLogService.deleteLog(id);
        return ResponseEntity.noContent().build();  // 204
    }
}