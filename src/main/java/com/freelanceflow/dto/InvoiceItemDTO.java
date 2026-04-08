package com.freelanceflow.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Data
public class InvoiceItemDTO {
    private String description;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
}
