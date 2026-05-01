package com.trackit.controller;

import org.springframework.web.bind.annotation.*;

import com.trackit.dto.DashboardStatsResponse;
import com.trackit.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // ADMIN / MANAGER dashboard
    @GetMapping("/stats")
    public DashboardStatsResponse getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}
