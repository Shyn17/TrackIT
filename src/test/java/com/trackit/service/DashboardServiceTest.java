package com.trackit.service;

import com.trackit.dto.DashboardStatsResponse;
import com.trackit.model.TaskStatus;
import com.trackit.repository.CommentRepository;
import com.trackit.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DashboardServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetDashboardStats() {
        when(taskRepository.countTotalTasks()).thenReturn(100L);
        when(taskRepository.countCompletedTasks()).thenReturn(50L);
        when(taskRepository.findByStatus(TaskStatus.CLOSED)).thenReturn(new ArrayList<>());
        when(taskRepository.findByStatus(TaskStatus.IN_PROGRESS)).thenReturn(new ArrayList<>());
        when(taskRepository.findByStatus(TaskStatus.OPEN)).thenReturn(new ArrayList<>());
        when(taskRepository.countTasksByStatus()).thenReturn(new ArrayList<>());
        
        when(taskRepository.findRecentlyUpdatedTasks(any(PageRequest.class))).thenReturn(new ArrayList<>());
        when(commentRepository.findRecentComments(any(PageRequest.class))).thenReturn(new ArrayList<>());

        DashboardStatsResponse response = dashboardService.getDashboardStats();

        assertNotNull(response);
        assertEquals(100L, response.getTotalBugs());
        assertEquals(50L, response.getTasksResolved());
        assertEquals(100L, response.getTotalCreatedTasks());
        assertEquals(50.0, response.getProgress().getCompletionPercentage());

        verify(taskRepository, times(1)).countTotalTasks();
        verify(taskRepository, times(1)).countCompletedTasks();
    }
}
