package com.trackit.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    // User who will receive the notification
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    // Related task (can be null for system notifications)
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    private boolean isRead;

    private LocalDateTime createdAt;

    public enum NotificationType {
        TASK_ASSIGNED,
        TASK_UPDATED,
        TASK_COMPLETED,
        COMMENT_ADDED,
        SYSTEM_ALERT
    }
}