package com.freelanceflow.controller;

import com.freelanceflow.dto.InvoiceDTO;
import com.freelanceflow.dto.InvoiceResponseDTO;
import com.freelanceflow.entity.enums.InvoiceStatus;
import com.freelanceflow.services.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")

public class InvoiceController {

    @Autowired
    private  InvoiceService invoiceService;


    @PostMapping
    public ResponseEntity<InvoiceResponseDTO> createInvoice(@RequestBody InvoiceDTO dto) {
        InvoiceResponseDTO response = invoiceService.createInvoice(dto);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<InvoiceResponseDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }


    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @PatchMapping("/{id}/invoiceStatus")
    public ResponseEntity<InvoiceResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam InvoiceStatus invoiceStatus) {

        return ResponseEntity.ok(invoiceService.updateStatus(id, invoiceStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}