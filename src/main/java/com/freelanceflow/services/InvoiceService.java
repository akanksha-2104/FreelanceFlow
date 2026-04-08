package com.freelanceflow.services;

import com.freelanceflow.dto.*;
import com.freelanceflow.entity.*;
import com.freelanceflow.entity.enums.InvoiceStatus;
import com.freelanceflow.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;
    private User getCurrentUser(){
        return(User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // CREATE INVOICE
    public InvoiceResponseDTO createInvoice(InvoiceDTO dto) {

        // 1. Current user
        User currentUser = getCurrentUser();

        // 2. Validate project ownership
        Project project = projectRepository.findById(dto.getProjectId())
                .filter(p -> p.getUser().getUserId().equals(currentUser.getUserId()))
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 3. Validate client ownership
        Client client = clientRepository.findById(dto.getClientId())
                .filter(c -> c.getUser().getUserId().equals(currentUser.getUserId()))
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // 4. Generate invoice number
        long count = invoiceRepository.countByUser(currentUser) + 1;
        String invoiceNumber = "INV-" + LocalDate.now().getYear() + "-" + String.format("%03d", count);

        // 5. Create invoice entity
        Invoice invoice = new Invoice();
        invoice.setUser(currentUser);
        invoice.setProject(project);
        invoice.setClient(client);

        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setIssueDate(dto.getIssueDate());
        invoice.setDueDate(dto.getDueDate());
        invoice.setNotes(dto.getNotes());
        invoice.setInvoiceStatus(InvoiceStatus.DRAFT);
        invoice.setCreatedAt(LocalDateTime.now());

        // Handle null tax
        BigDecimal taxPercent = dto.getTaxPercent() != null ? dto.getTaxPercent() : BigDecimal.ZERO;
        invoice.setTaxPercent(taxPercent);

        // 6. Process items
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Invoice must contain at least one item");
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (InvoiceItemDTO itemDTO : dto.getItems()) {

            InvoiceItem item = new InvoiceItem();
            item.setDescription(itemDTO.getDescription());
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());

            // amount = quantity * unitPrice
            BigDecimal amount = itemDTO.getUnitPrice()
                    .multiply(itemDTO.getQuantity());

            item.setAmount(amount);
            item.setInvoice(invoice);

            invoice.getItems().add(item);

            subtotal = subtotal.add(amount);
        }

        // 7. Set subtotal
        invoice.setSubtotal(subtotal);

        // 8. Calculate total amount
        BigDecimal taxAmount = subtotal
                .multiply(taxPercent)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = subtotal.add(taxAmount);

        invoice.setTotalAmount(totalAmount);

        // 9. Save invoice (cascade saves items)
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // 10. Return response DTO
        return mapToResponse(savedInvoice);
    }

    //GET ALL INVOICES
    public List<InvoiceResponseDTO> getAllInvoices() {
        User currentUser = getCurrentUser();

        return invoiceRepository.findAllByUser(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET INVOICE BY ID
    public InvoiceResponseDTO getInvoiceById(Long invoiceId) {
        User currentUser = getCurrentUser();

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .filter(inv -> inv.getUser().getUserId().equals(currentUser.getUserId()))
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        return mapToResponse(invoice);
    }

    //UPDATE STATUS
    public InvoiceResponseDTO updateStatus(Long invoiceId, InvoiceStatus status) {
        User currentUser = getCurrentUser();

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .filter(inv -> inv.getUser().getUserId().equals(currentUser.getUserId()))
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setInvoiceStatus(status);

        return mapToResponse(invoiceRepository.save(invoice));
    }

    //DELETE INVOICE
    public void deleteInvoice(Long invoiceId) {
        User currentUser = getCurrentUser();

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .filter(inv -> inv.getUser().getUserId().equals(currentUser.getUserId()))
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoiceRepository.delete(invoice);
    }

    //MAPPER METHOD
    private InvoiceResponseDTO mapToResponse(Invoice invoice) {

        InvoiceResponseDTO dto = new InvoiceResponseDTO();

        dto.setInvoiceId(invoice.getInvoiceId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setIssueDate(invoice.getIssueDate());
        dto.setDueDate(invoice.getDueDate());

        dto.setSubtotal(invoice.getSubtotal());
        dto.setTaxPercent(invoice.getTaxPercent());
        dto.setTotalAmount(invoice.getTotalAmount());

        dto.setInvoiceStatus(invoice.getInvoiceStatus().name());
        dto.setNotes(invoice.getNotes());
        dto.setPdfPath(invoice.getPdfPath());
        dto.setCreatedAt(invoice.getCreatedAt());

        dto.setClientId(invoice.getClient().getClientId());
        dto.setClientName(invoice.getClient().getClientName());

        dto.setProjectId(invoice.getProject().getProjectId());
        dto.setProjectTitle(invoice.getProject().getTitle());

        List<InvoiceItemResponseDTO> items = invoice.getItems()
                .stream()
                .map(item -> {
                    InvoiceItemResponseDTO i = new InvoiceItemResponseDTO();
                    i.setItemId(item.getItemId());
                    i.setDescription(item.getDescription());
                    i.setQuantity(item.getQuantity());
                    i.setUnitPrice(item.getUnitPrice());
                    i.setAmount(item.getAmount());
                    return i;
                })
                .collect(Collectors.toList());

        dto.setItems(items);

        return dto;
    }
}