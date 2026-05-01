package com.trackit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatusCountResponse {
    private String status;
    private long count;
}