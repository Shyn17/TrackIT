package com.trackit.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.trackit.dto.DashboardStatsResponse;
import com.trackit.dto.DashboardStatsResponse.ActivityDto;
import com.trackit.dto.DashboardStatsResponse.SimpleUserDto;
import com.trackit.dto.DashboardStatsResponse.TaskDto;
import com.trackit.dto.ProgressResponse;
import com.trackit.dto.StatusCountResponse;
import com.trackit.model.Comment;
import com.trackit.model.Task;
import com.trackit.model.TaskStatus;
import com.trackit.repository.CommentRepository;
import com.trackit.repository.TaskRepository;

import lombok.Setter;

@Setter
@Service
public class DashboardService {

    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;

    public DashboardService(TaskRepository taskRepository, CommentRepository commentRepository) {
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
    }

    public DashboardStatsResponse getDashboardStats() {

        /* ---------- TOTAL COUNTS ---------- */
        long totalBugs         = taskRepository.countTotalTasks();
        long tasksResolved     = taskRepository.countCompletedTasks();
        long tasksClosed       = taskRepository.findByStatus(TaskStatus.CLOSED).size();
        long tasksInProgress   = taskRepository.findByStatus(TaskStatus.IN_PROGRESS).size();
        long totalCreatedTasks = totalBugs;

        /* ---------- STATUS DISTRIBUTION ---------- */
        List<StatusCountResponse> statusCounts = new ArrayList<>();
        for (Object[] row : taskRepository.countTasksByStatus()) {
            TaskStatus status = (TaskStatus) row[0];
            long count = (long) row[1];
            statusCounts.add(new StatusCountResponse(status.name(), count));
        }

        /* ---------- OPEN TASKS (for dashboard table) ---------- */
        List<Task> openTaskEntities = taskRepository.findByStatus(TaskStatus.OPEN);
        List<TaskDto> openTaskDtos = openTaskEntities.stream().map(t -> {
            TaskDto dto = new TaskDto();
            dto.setId(t.getId());
            dto.setTitle(t.getTitle());
            dto.setStatus(t.getStatus() != null ? t.getStatus().name() : null);
            dto.setPriority(t.getPriority() != null ? t.getPriority().name() : null);
            if (t.getAssignedTo() != null) {
                SimpleUserDto u = new SimpleUserDto();
                u.setId(t.getAssignedTo().getId());
                u.setUsername(t.getAssignedTo().getUsername());
                u.setEmail(t.getAssignedTo().getEmail());
                dto.setAssignedTo(u);
            }
            return dto;
        }).collect(Collectors.toList());

        /* ---------- RECENT ACTIVITIES ---------- */
        // Collect up to 5 recent task updates
        List<Task> recentTasks = taskRepository.findRecentlyUpdatedTasks(PageRequest.of(0, 5));

        // Collect up to 5 recent comments
        List<Comment> recentComments = commentRepository.findRecentComments(PageRequest.of(0, 5));

        // Build ActivityDto list from both sources
        AtomicLong idSeq = new AtomicLong(1);
        List<ActivityDto> activities = new ArrayList<>();

        for (Task t : recentTasks) {
            ActivityDto a = new ActivityDto();
            a.setId(idSeq.getAndIncrement());
            a.setType("TASK_UPDATE");
            a.setTaskTitle(t.getTitle() != null ? t.getTitle() : "Untitled");
            a.setDescription(
                "Task status is " + (t.getStatus() != null ? t.getStatus().name() : "unknown")
                + (t.getReporterEmail() != null ? " · by " + t.getReporterEmail() : "")
            );
            a.setCreatedAt(t.getUpdatedAt() != null ? t.getUpdatedAt() : t.getCreatedAt());
            activities.add(a);
        }

        for (Comment c : recentComments) {
            ActivityDto a = new ActivityDto();
            a.setId(idSeq.getAndIncrement());
            a.setType("COMMENT");
            String taskTitle = (c.getTask() != null && c.getTask().getTitle() != null)
                    ? c.getTask().getTitle() : "a task";
            a.setTaskTitle(taskTitle);
            String author = (c.getUser() != null)
                    ? (c.getUser().getUsername() != null ? c.getUser().getUsername() : c.getUser().getEmail())
                    : "Someone";
            a.setDescription(author + " commented: \"" + truncate(c.getContent(), 60) + "\"");
            a.setCreatedAt(c.getCreatedAt());
            activities.add(a);
        }

        // Sort by date descending, take top 10
        activities.sort(Comparator.comparing(
                ActivityDto::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())
        ));
        List<ActivityDto> topActivities = activities.stream().limit(10).collect(Collectors.toList());

        /* ---------- PROGRESS ---------- */
        long pending = totalBugs - tasksResolved;
        double percentage = totalBugs == 0 ? 0 : (tasksResolved * 100.0) / totalBugs;

        ProgressResponse progress = new ProgressResponse(
                totalBugs,     // total
                tasksResolved, // completed
                pending,       // pending
                percentage     // completionPercentage
        );

        /* ---------- BUILD RESPONSE ---------- */
        DashboardStatsResponse response = new DashboardStatsResponse();
        response.setTotalBugs(totalBugs);
        response.setTotalCreatedTasks(totalCreatedTasks);
        response.setTasksInProgress(tasksInProgress);
        response.setTasksResolved(tasksResolved);
        response.setTasksClosed(tasksClosed);
        response.setCreatedTasks(java.util.Collections.emptyList());
        response.setOpenTasks(openTaskDtos);
        response.setRecentActivities(topActivities);
        response.setBugsByStatus(statusCounts);
        response.setProgress(progress);

        return response;
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "…";
    }
}