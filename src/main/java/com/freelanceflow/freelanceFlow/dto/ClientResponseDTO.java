package com.freelanceflow.freelanceFlow.dto;

import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
public class ClientResponseDTO {
    @Getter
    private Long clientId;

    @Getter
    private String clientName;

    @Getter
    private String email;

    @Getter
    private String phone;

    @Getter
    private String company;

    @Getter
    private String address;

    @Getter
    private LocalDateTime createdAt;
}
