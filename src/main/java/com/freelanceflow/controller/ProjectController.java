package com.freelanceflow.controller;

import com.freelanceflow.dto.ProjectDTO;
import com.freelanceflow.dto.ProjectResponseDTO;
import com.freelanceflow.entity.enums.ProjectStatus;
import com.freelanceflow.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectDTO dto) {
        ProjectResponseDTO response = projectService.createProject(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectDTO dto) {

        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ProjectStatus status) {

        return ResponseEntity.ok(projectService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build(); // 204
    }

}