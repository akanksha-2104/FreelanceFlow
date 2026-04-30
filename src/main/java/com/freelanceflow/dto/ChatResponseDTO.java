package com.freelanceflow.dto;

import lombok.Data;

@Data
public class ChatResponseDTO {
    private String reply;
    private boolean success;

    public ChatResponseDTO(String reply, boolean success) {
        this.reply   = reply;
        this.success = success;
    }
}
