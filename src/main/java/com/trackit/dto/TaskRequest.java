package com.trackit.dto;

import com.trackit.model.Priority;
import com.trackit.model.Severity;

import lombok.Data;

@Data
public class TaskRequest {

    private String title;
    private String description;

    private Priority priority;
    private Severity severity;
}