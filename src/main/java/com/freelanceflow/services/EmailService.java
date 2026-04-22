//package com.freelanceflow.service;
//
//import com.freelanceflow.entity.Invoice;
//import com.freelanceflow.entity.User;
//import com.freelanceflow.repository.InvoiceRepository;
//import com.freelanceflow.services.PDFService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import jakarta.mail.internet.MimeMessage;
//import java.math.BigDecimal;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Autowired
//    private InvoiceRepository invoiceRepository;
//
//    @Autowired
//    private PDFService pdfService;
//
//    private User getCurrentUser() {
//        return (User) SecurityContextHolder
//                .getContext()
//                .getAuthentication()
//                .getPrincipal();
//    }
//
//    public void sendInvoice(Long invoiceId) {
//        User user = getCurrentUser();
//
//        Invoice invoice = invoiceRepository
//                .findByInvoiceIdAndUser(invoiceId, user)
//                .orElseThrow(() -> new RuntimeException("Invoice not found"));
//
//        try {
//            byte[] pdfBytes = pdfService.generateInvoicePDF(invoiceId);
//
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(
//                    message, true, "UTF-8");
//
//            helper.setTo(invoice.getClient().getEmail());
//            helper.setSubject("Invoice " + invoice.getInvoiceNumber()
//                    + " from " + user.getFullName());
//
//            String body = "<h2>Invoice " + invoice.getInvoiceNumber() + "</h2>"
//                    + "<p>Dear " + invoice.getClient().getClientName() + ",</p>"
//                    + "<p>Please find your invoice attached.</p>"
//                    + "<table border='1' cellpadding='8'>"
//                    + "<tr><td><b>Invoice Number</b></td><td>"
//                    + invoice.getInvoiceNumber() + "</td></tr>"
//                    + "<tr><td><b>Issue Date</b></td><td>"
//                    + invoice.getIssueDate() + "</td></tr>"
//                    + "<tr><td><b>Due Date</b></td><td>"
//                    + invoice.getDueDate() + "</td></tr>"
//                    + "<tr><td><b>Total Amount</b></td><td>Rs. "
//                    + invoice.getTotalAmount() + "</td></tr>"
//                    + "</table>"
//                    + "<p>Thank you for your business.</p>"
//                    + "<p>Regards,<br>" + user.getFullName() + "</p>";
//
//            helper.setText(body, true);
//            helper.addAttachment(
//                    invoice.getInvoiceNumber() + ".pdf",
//                    new org.springframework.core.io.ByteArrayResource(pdfBytes)
//            );
//
//            mailSender.send(message);
//
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to send email: " + e.getMessage());
//        }
//    }
//}