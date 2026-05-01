package com.trackit.dto;

import java.time.LocalDateTime;

import com.trackit.model.Notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private String message;
    private String type;
    private String recipientEmail;
    private Long taskId;
    private String taskTitle;
    private boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse fromEntity(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .recipientEmail(notification.getRecipient().getEmail())
                .taskId(notification.getTask() != null ? notification.getTask().getId() : null)
                .taskTitle(notification.getTask() != null ? notification.getTask().getTitle() : null)
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}