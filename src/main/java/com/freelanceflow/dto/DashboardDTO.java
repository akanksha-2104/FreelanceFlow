package com.freelanceflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private Double totalRevenue;

    private Integer activeProjects;
    private Integer completedProjects;
    private Integer onHoldProjects;

    private Integer unpaidInvoices;

    private Double hoursThisMonth;

    private List<MonthlyRevenueDTO> monthlyRevenue;
    private List<ProjectDeadlineDTO> upcomingDeadlines;
}