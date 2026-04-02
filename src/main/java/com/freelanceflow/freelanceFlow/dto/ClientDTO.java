package com.freelanceflow.freelanceFlow.dto;

import lombok.Data;
import lombok.Getter;

@Data
public class ClientDTO {
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
}
