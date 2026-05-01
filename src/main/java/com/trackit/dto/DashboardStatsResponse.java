package com.trackit.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // ✅ generates getters + setters
@NoArgsConstructor      // ✅ required for setter-based building
public class DashboardStatsResponse {

    private long totalBugs;
    private long totalCreatedTasks;
    private long tasksInProgress;
    private long tasksResolved;
    private long tasksClosed;

    private List<TaskDto> createdTasks;
    private List<TaskDto> openTasks;
    private List<ActivityDto> recentActivities;

    private List<StatusCountResponse> bugsByStatus;
    private ProgressResponse progress;

    // ----------------- NESTED DTOs -----------------

    @Data
    public static class TaskDto {
        private Long id;
        private String title;
        private String status;
        private String priority;
        private SimpleUserDto assignedTo;
    }

    @Data
    public static class ActivityDto {
        private Long id;
        private String type;
        private String description;
        private String taskTitle;
        private LocalDateTime createdAt;
    }

    @Data
    public static class SimpleUserDto {
        private Long id;
        private String username;
        private String email;
    }
}