package com.freelanceflow.services;

import com.freelanceflow.entity.Client;
import com.freelanceflow.entity.Invoice;
import com.freelanceflow.entity.InvoiceItem;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;

@Service
public class PDFService {
    public byte[] generateInvoicePDF(Invoice invoice){

        //iText Objects
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(36, 36, 36, 36);

        //header section
        Table headerTable = new Table(2).useAllAvailableWidth();

        //left cell
        Cell leftCell = new Cell().setBorder(Border.NO_BORDER);
        leftCell.add(new Paragraph("FreelanceFlow")
                .setBold()
                .setFontSize(20)
                .setFontColor(ColorConstants.BLUE));

        leftCell.add(new Paragraph(invoice.getUser().getFullName()));

        //right cell
        Cell rightCell = new Cell().setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT);

        rightCell.add(new Paragraph("INVOICE").setBold().setFontSize(18));
        rightCell.add(new Paragraph("Invoice #: " + invoice.getInvoiceNumber()));
        rightCell.add(new Paragraph("Issue Date: " + invoice.getIssueDate()));
        rightCell.add(new Paragraph("Due Date: " + invoice.getDueDate()));

        //add to table
        headerTable.addCell(leftCell);
        headerTable.addCell(rightCell);
        document.add(headerTable);

        //divider line
        LineSeparator line = new LineSeparator(new SolidLine());
        line.setMarginTop(10);
        line.setMarginBottom(10);
        document.add(line);

        //bill to section
        document.add(new Paragraph("BILL TO:").setBold());

        Client client = invoice.getClient();

        document.add(new Paragraph(client.getClientName()));
        document.add(new Paragraph(client.getCompany()));
        document.add(new Paragraph(client.getEmail()));

        //table setup
        Table table = new Table(
                UnitValue.createPercentArray(new float[]{50, 15, 20, 15}))
                .useAllAvailableWidth();

        table.addHeaderCell(new Cell().add(new Paragraph("Description")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Qty")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Unit Price")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Amount")).setBold());

        //add items
        int index = 0;

        for (InvoiceItem item : invoice.getItems()) {

            table.addCell(item.getDescription());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.valueOf(item.getUnitPrice()));
            table.addCell(String.valueOf(item.getAmount()));

            index++;
        }

        //Add table
        document.add(table);

        //Totals section
        Table totalsTable = new Table(2);
        totalsTable.setWidth(UnitValue.createPercentValue(40));
        totalsTable.setHorizontalAlignment(HorizontalAlignment.RIGHT);

        //Rows
        totalsTable.addCell("Subtotal");
        totalsTable.addCell(String.valueOf(invoice.getSubtotal()));

        totalsTable.addCell("Tax");
        totalsTable.addCell(String.valueOf(invoice.getTaxPercent()));

        totalsTable.addCell(new Paragraph("Total").setBold());
        totalsTable.addCell(new Paragraph(String.valueOf(invoice.getTotalAmount())).setBold());

        document.add(totalsTable);

        //notes
        if (invoice.getNotes() != null && !invoice.getNotes().isEmpty()) {

            document.add(new Paragraph("Notes:").setBold());

            document.add(new Paragraph(invoice.getNotes()));
        }

        document.close();
        return baos.toByteArray();
    }
}
