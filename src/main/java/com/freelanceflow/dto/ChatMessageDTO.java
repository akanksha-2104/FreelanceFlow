package com.freelanceflow.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private String role;     // "user" or "assistant"
    private String content;
}
