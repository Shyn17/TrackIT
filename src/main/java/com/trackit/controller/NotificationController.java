package com.trackit.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trackit.dto.NotificationResponse;
import com.trackit.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Get all notifications for current user
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        List<NotificationResponse> notifications = notificationService.getUserNotifications(email)
                .stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    // Get unread notifications for current user
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(Authentication authentication) {
        String email = authentication.getName();
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(email)
                .stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    // Get unread count for current user
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        long count = notificationService.getUnreadCount(email);
        return ResponseEntity.ok(count);
    }

    // Mark notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        notificationService.markAsRead(id, email);
        return ResponseEntity.ok().build();
    }

    // Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        notificationService.deleteNotification(id, email);
        return ResponseEntity.ok().build();
    }
}