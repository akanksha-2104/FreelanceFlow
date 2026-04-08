package com.freelanceflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
public class InvoiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @Column(nullable = false)
    String description;

    @Column(precision = 8, scale=2)
    BigDecimal quantity;

    @Column(precision = 10, scale=2)
    BigDecimal unitPrice;

    @Column(precision = 10, scale=2)
    BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    @JsonIgnore
    Invoice invoice;
}
