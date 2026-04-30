package com.freelanceflow.controller;

import com.freelanceflow.services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AiService aiService;

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(
            @RequestBody Map<String, String> body) {

        String projectName = body.get("projectName");

        if (projectName == null || projectName.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "projectName is required"));
        }

        String description = aiService
                .generateProjectDescription(projectName.trim());

        return ResponseEntity.ok(Map.of("description", description));
    }



}