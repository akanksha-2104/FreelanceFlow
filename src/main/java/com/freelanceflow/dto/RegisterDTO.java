package com.freelanceflow.dto;

import lombok.Data;
import lombok.Getter;

@Data
public class RegisterDTO {
    @Getter
    private String username;

    @Getter
    private String email;

    @Getter
    private String password;

    @Getter
    private String fullName;

}
