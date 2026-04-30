package com.freelanceflow.controller;

import com.freelanceflow.dto.ChatRequestDTO;
import com.freelanceflow.dto.ChatResponseDTO;
import com.freelanceflow.entity.User;
import com.freelanceflow.repository.UserRepository;
import com.freelanceflow.services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AiService aiService;

    @Autowired
    private UserRepository userRepository;

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

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(
            @RequestBody ChatRequestDTO request) {
        try {
            // get current authenticated user
            User user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            String reply = aiService.chat(
                    user,
                    request.getMessage(),
                    request.getConversationHistory()
            );

            return ResponseEntity.ok(
                    new ChatResponseDTO(reply, true)
            );

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new ChatResponseDTO(
                            "Sorry, I couldn't process that. " +
                                    "Please try again.",
                            false
                    )
            );
        }
    }

}