package com.freelanceflow.repository;

import com.freelanceflow.entity.Invoice;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    List<Invoice> findAllByUser(User user);

    Optional<Invoice> findByInvoiceIdAndUser(Long invoiceId, User user);

    List<Invoice> findAllByUserAndInvoiceStatus(User user, InvoiceStatus invoiceStatus);


    long countByUser(User user);
}
