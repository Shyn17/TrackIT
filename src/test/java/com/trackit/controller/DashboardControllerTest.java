package com.trackit.controller;

import com.trackit.dto.DashboardStatsResponse;
import com.trackit.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(dashboardController).build();
    }

    @Test
    void testGetDashboardStats() throws Exception {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalBugs(100L);
        stats.setTotalCreatedTasks(50L);

        when(dashboardService.getDashboardStats()).thenReturn(stats);

        mockMvc.perform(get("/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalBugs").value(100))
                .andExpect(jsonPath("$.totalCreatedTasks").value(50));

        verify(dashboardService, times(1)).getDashboardStats();
    }
}
