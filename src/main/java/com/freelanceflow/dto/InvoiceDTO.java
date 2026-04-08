package com.freelanceflow.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Data
public class InvoiceDTO {
    private Long projectId;
    private Long clientId;

    private LocalDate issueDate;
    private LocalDate dueDate;

    private BigDecimal taxPercent;
    private String notes;

    private List<InvoiceItemDTO> items;
}
