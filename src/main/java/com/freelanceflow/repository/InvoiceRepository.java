package com.freelanceflow.repository;

import com.freelanceflow.entity.Invoice;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    List<Invoice> findAllByUser(User user);

    Optional<Invoice> findByInvoiceIdAndUser(Long invoiceId, User user);

    List<Invoice> findAllByUserAndInvoiceStatus(User user, InvoiceStatus invoiceStatus);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.user = :user AND i.invoiceStatus = 'PAID' AND i.issueDate BETWEEN :start AND :end")
    Double getRevenueBetweenDates(@Param("user") User user,
                                  @Param("start") LocalDate start,
                                  @Param("end") LocalDate end);

    // 🔹 Total revenue (PAID invoices)
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.user = :user AND i.invoiceStatus = com.freelanceflow.entity.enums.InvoiceStatus.PAID")
    Double getTotalRevenue(@Param("user") User user);

    // 🔹 Unpaid invoices
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.user = :user AND i.invoiceStatus IN ('DRAFT','SENT','OVERDUE')")
    Long countUnpaidInvoices(@Param("user") User user);

    long countByUser(User user);
}
