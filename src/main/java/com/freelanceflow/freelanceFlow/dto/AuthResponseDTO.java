package com.freelanceflow.freelanceFlow.dto;

import lombok.Data;
import lombok.Getter;

@Data
public class AuthResponseDTO {
    @Getter
    private String token;

    @Getter
    private Long userId;

    @Getter
    private String email;

    @Getter
    private String userName;
}
