package com.freelanceflow.services;

import com.freelanceflow.dto.*;
import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.ProjectStatus;
import com.freelanceflow.repository.InvoiceRepository;
import com.freelanceflow.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public DashboardDTO getDashboard(User user) {

        // 🔹 Total Revenue
        Double totalRevenue = invoiceRepository.getTotalRevenue(user);
        if (totalRevenue == null) totalRevenue = 0.0;

        // 🔹 Project counts
        int active = projectRepository.countByUserAndStatus(user, ProjectStatus.ACTIVE).intValue();
        int completed = projectRepository.countByUserAndStatus(user, ProjectStatus.COMPLETED).intValue();
        int onHold = projectRepository.countByUserAndStatus(user, ProjectStatus.ON_HOLD).intValue();

        // 🔹 Unpaid invoices
        int unpaid = invoiceRepository.countUnpaidInvoices(user).intValue();

        // 🔹 Monthly revenue (last 6 months)
        List<MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate start = now.minusMonths(i).withDayOfMonth(1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

            Double revenue = invoiceRepository.getRevenueBetweenDates(user, start, end);

            String label = start.getMonth()
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                    + " " + start.getYear();

            monthlyRevenue.add(new MonthlyRevenueDTO(
                    label,
                    revenue != null ? revenue : 0.0
            ));
        }

        // 🔹 Upcoming deadlines
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);

        List<ProjectDeadlineDTO> deadlines =
                projectRepository.findUpcomingDeadlines(user, today, nextWeek)
                        .stream()
                        .map(p -> new ProjectDeadlineDTO(
                                p.getProjectId(),
                                p.getTitle(),
                                // 🔥 FIX THIS BASED ON YOUR ENTITY
                                p.getClient().getClientName(),  // OR p.getClient().getName()
                                p.getDeadline()
                        ))
                        .collect(Collectors.toList());

        // 🔹 Hours this month (for now dummy if not implemented)
        Double hoursThisMonth = 0.0;

        return new DashboardDTO(
                totalRevenue,
                active,
                completed,
                onHold,
                unpaid,
                hoursThisMonth,
                monthlyRevenue,
                deadlines
        );
    }
}