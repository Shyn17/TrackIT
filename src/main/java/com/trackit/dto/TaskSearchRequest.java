package com.trackit.dto;



import com.trackit.model.Priority;
import com.trackit.model.Severity;
import com.trackit.model.TaskStatus;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TaskSearchRequest {

    private TaskStatus status;
    private Priority priority;
    private Severity severity;

    // filter by developer
    private Long assignedDeveloperId;

    // search in title + description
    private String keyword;
    private LocalDateTime fromDate;
private LocalDateTime toDate;
}