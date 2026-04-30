package com.freelanceflow.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    // ── Generate project description ─────────────────────────
    public String generateProjectDescription(String projectName) {
        String prompt = "Write a concise, professional project description "
                + "for a freelance project called: \"" + projectName + "\". "
                + "Keep it to 2-3 small sentences."
                + "Do not use bullet points. Plain paragraph only.";

        return callGroq(prompt);
    }




    // ── Core Groq API caller ──────────────────────────────────
    private String callGroq(String userMessage) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", userMessage
            );

            Map<String, Object> body = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", List.of(message),
                    "max_tokens", 500,
                    "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GROQ_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            throw new RuntimeException(
                    "AI API call failed: " + e.getMessage()
            );
        }
    }
}