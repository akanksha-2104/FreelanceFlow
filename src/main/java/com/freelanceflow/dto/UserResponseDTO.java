package com.freelanceflow.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserResponseDTO {

    private Long userId;
    private String username;
    private String email;
    private String fullName;

}
