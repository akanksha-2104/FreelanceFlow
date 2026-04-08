package com.freelanceflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.freelanceflow.entity.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    @Column(unique=true)
    private String invoiceNumber;

    private LocalDate issueDate;
    private LocalDate dueDate;

    @Column(precision=10, scale=2)
    private BigDecimal subtotal;

    @Column(precision=5, scale=2)
    private BigDecimal taxPercent;

    @Column(precision=10, scale=2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus invoiceStatus = InvoiceStatus.DRAFT;

    private String notes;
    private String pdfPath;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    User user;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnore
    Client client;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnore
    Project project;

    @OneToMany(mappedBy="invoice", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<InvoiceItem> items = new ArrayList<>();

}
