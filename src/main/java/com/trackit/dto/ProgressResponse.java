package com.trackit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProgressResponse {
    private long total;
    private long completed;
    private long pending;
    private double completionPercentage;
}