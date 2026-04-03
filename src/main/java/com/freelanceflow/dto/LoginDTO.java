package com.freelanceflow.dto;

import lombok.Data;
import lombok.Getter;

@Data
public class LoginDTO {

    @Getter
    private String email;

    @Getter
    private String password;
}
