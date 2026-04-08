package com.freelanceflow.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Data
public class InvoiceResponseDTO {
    private Long invoiceId;
    private String invoiceNumber;

    private LocalDate issueDate;
    private LocalDate dueDate;

    private BigDecimal subtotal;
    private BigDecimal taxPercent;
    private BigDecimal totalAmount;

    private String invoiceStatus;
    private String notes;

    private String pdfPath;
    private LocalDateTime createdAt;

    private Long clientId;
    private String clientName;

    private Long projectId;
    private String projectTitle;

    private List<InvoiceItemResponseDTO> items;
}
