package com.freelanceflow.controller;

import com.freelanceflow.dto.InvoiceDTO;
import com.freelanceflow.dto.InvoiceResponseDTO;
import com.freelanceflow.entity.Invoice;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.InvoiceStatus;
import com.freelanceflow.repository.InvoiceRepository;
import com.freelanceflow.services.InvoiceService;
import com.freelanceflow.services.PDFService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")

public class InvoiceController {

    @Autowired
    private  InvoiceService invoiceService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PDFService pdfService;

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

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable Long id) {
        //Get current user
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        //Fetch invoice with ownership check
        Invoice invoice = invoiceRepository
                .findByInvoiceIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        //Generate PDF
        byte[] pdfBytes = pdfService.generateInvoicePDF(invoice);

        //Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        headers.setContentDispositionFormData(
                "attachment",
                invoice.getInvoiceNumber() + ".pdf"
        );

        //Return response
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}