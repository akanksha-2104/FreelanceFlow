package com.freelanceflow.services;

import com.freelanceflow.entity.Invoice;
import com.freelanceflow.entity.User;
import com.freelanceflow.repository.InvoiceRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PDFService pdfService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private User getCurrentUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public void sendInvoice(Long invoiceId) {

        User currentUser = getCurrentUser();

        // fetch invoice and verify ownership
        Invoice invoice = invoiceRepository
                .findByInvoiceIdAndUser(invoiceId, currentUser)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // check client has an email
        if (invoice.getClient().getEmail() == null
                || invoice.getClient().getEmail().isEmpty()) {
            throw new RuntimeException(
                    "Client does not have an email address"
            );
        }

        try {
            // generate PDF bytes
            byte[] pdfBytes = pdfService.generateInvoicePDF(invoice);

            // build the email
            MimeMessage message = mailSender.createMimeMessage();

            // true = multipart (needed for attachments)
            MimeMessageHelper helper = new MimeMessageHelper(
                    message, true, "UTF-8"
            );

            helper.setFrom(fromEmail);
            helper.setTo(invoice.getClient().getEmail());
            helper.setSubject(
                    "Invoice " + invoice.getInvoiceNumber()
                            + " from " + currentUser.getFullName()
            );

            // build HTML email body
            String htmlBody = buildEmailBody(invoice, currentUser);
            helper.setText(htmlBody, true); // true = HTML

            // attach the PDF
            helper.addAttachment(
                    invoice.getInvoiceNumber() + ".pdf",
                    new ByteArrayResource(pdfBytes),
                    "application/pdf"
            );

            // send
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send email: " + e.getMessage()
            );
        }
    }

    private String buildEmailBody(Invoice invoice, User user) {
        return "<!DOCTYPE html>"
                + "<html><body style='font-family: Arial, sans-serif;"
                + " color: #333; max-width: 600px; margin: 0 auto;'>"

                + "<div style='background: #1E3A5F; padding: 20px;"
                + " border-radius: 8px 8px 0 0;'>"
                + "<h1 style='color: white; margin: 0; font-size: 24px;'>"
                + "FreelanceFlow</h1>"
                + "</div>"

                + "<div style='padding: 30px; border: 1px solid #ddd;"
                + " border-top: none; border-radius: 0 0 8px 8px;'>"

                + "<h2 style='color: #1E3A5F;'>Invoice "
                + invoice.getInvoiceNumber() + "</h2>"

                + "<p>Dear " + invoice.getClient().getClientName() + ",</p>"
                + "<p>Please find your invoice attached to this email."
                + " Here is a summary:</p>"

                + "<table style='width: 100%; border-collapse: collapse;"
                + " margin: 20px 0;'>"
                + "<tr style='background: #f5f5f5;'>"
                + "<td style='padding: 10px; border: 1px solid #ddd;"
                + " font-weight: bold;'>Invoice Number</td>"
                + "<td style='padding: 10px; border: 1px solid #ddd;'>"
                + invoice.getInvoiceNumber() + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 10px; border: 1px solid #ddd;"
                + " font-weight: bold;'>Issue Date</td>"
                + "<td style='padding: 10px; border: 1px solid #ddd;'>"
                + invoice.getIssueDate() + "</td>"
                + "</tr>"
                + "<tr style='background: #f5f5f5;'>"
                + "<td style='padding: 10px; border: 1px solid #ddd;"
                + " font-weight: bold;'>Due Date</td>"
                + "<td style='padding: 10px; border: 1px solid #ddd;'>"
                + invoice.getDueDate() + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 10px; border: 1px solid #ddd;"
                + " font-weight: bold;'>Amount Due</td>"
                + "<td style='padding: 10px; border: 1px solid #ddd;"
                + " font-weight: bold; color: #1E3A5F; font-size: 18px;'>"
                + "Rs. " + invoice.getTotalAmount() + "</td>"
                + "</tr>"
                + "</table>"

                + (invoice.getNotes() != null && !invoice.getNotes().isEmpty()
                ? "<p><b>Notes:</b> " + invoice.getNotes() + "</p>"
                : "")

                + "<p style='margin-top: 30px;'>Thank you for your business."
                + " Please make the payment by "
                + invoice.getDueDate() + ".</p>"

                + "<p>Regards,<br>"
                + "<strong>" + user.getFullName() + "</strong></p>"

                + "<hr style='border: none; border-top: 1px solid #ddd;"
                + " margin: 20px 0;'>"
                + "<p style='color: #999; font-size: 12px;'>"
                + "This email was sent via FreelanceFlow</p>"

                + "</div></body></html>";
    }
}