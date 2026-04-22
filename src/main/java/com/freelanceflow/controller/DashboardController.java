package com.freelanceflow.controller;

import com.freelanceflow.dto.DashboardDTO;
import com.freelanceflow.entity.User;
import com.freelanceflow.services.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardDTO getDashboard(@AuthenticationPrincipal User user) {
        return dashboardService.getDashboard(user);
    }


}
