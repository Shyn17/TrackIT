package com.trackit.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.trackit.model.Notification;
import com.trackit.model.Role;
import com.trackit.model.Task;
import com.trackit.model.User;
import com.trackit.repository.NotificationRepository;
import com.trackit.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService; // ✅ Injected properly

    // 🔔 Notify when task is assigned
    public void notifyTaskAssigned(Task task, String developerEmail) {

        User developer = userRepository.findByEmail(developerEmail)
                .orElseThrow(() -> new RuntimeException("Developer not found"));

        // Save notification
        Notification notification = Notification.builder()
                .message("You have been assigned to task: " + task.getTitle())
                .type(Notification.NotificationType.TASK_ASSIGNED)
                .recipient(developer)
                .task(task)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // 📧 Send email
        if (developer.getEmail() != null) {
            try {
                emailService.sendEmail(
                        developer.getEmail(),
                        "Task Assigned",
                        "You have been assigned to task: " + task.getTitle()
                );
            } catch (Exception e) {
                System.out.println("Email sending failed (Task Assigned)");
            }
        }
    }

    // 🔔 Notify when task is updated
    public void notifyTaskUpdated(Task task, String updaterEmail) {

        // Notify task creator
        if (task.getUser() != null && !task.getUser().getEmail().equals(updaterEmail)) {

            Notification notification = Notification.builder()
                    .message("Your task '" + task.getTitle() + "' has been updated to " + task.getStatus())
                    .type(Notification.NotificationType.TASK_UPDATED)
                    .recipient(task.getUser())
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    task.getUser().getEmail(),
                    "Task Updated",
                    "Your task '" + task.getTitle() + "' is now " + task.getStatus()
            );
        }

        // Notify assigned developer
        if (task.getAssignedTo() != null &&
            !task.getAssignedTo().getEmail().equals(updaterEmail)) {

            Notification notification = Notification.builder()
                    .message("Task '" + task.getTitle() + "' assigned to you has been updated to " + task.getStatus())
                    .type(Notification.NotificationType.TASK_UPDATED)
                    .recipient(task.getAssignedTo())
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    task.getAssignedTo().getEmail(),
                    "Task Updated",
                    "Task '" + task.getTitle() + "' is now " + task.getStatus()
            );
        }
    }

    // 🔔 Notify when task is completed
    public void notifyTaskCompleted(Task task) {

        // Notify task creator/reporter
        if (task.getUser() != null) {
            Notification notification = Notification.builder()
                    .message("Your task '" + task.getTitle() + "' has been marked as " + task.getStatus())
                    .type(Notification.NotificationType.TASK_COMPLETED)
                    .recipient(task.getUser())
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    task.getUser().getEmail(),
                    "Task Completed",
                    "Your task '" + task.getTitle() + "' has been marked as " + task.getStatus()
            );
        }

        // Notify assigned developer (if different from reporter)
        if (task.getAssignedTo() != null && 
            (task.getUser() == null || !task.getAssignedTo().getId().equals(task.getUser().getId()))) {
            
            Notification notification = Notification.builder()
                    .message("Task '" + task.getTitle() + "' assigned to you has been marked as " + task.getStatus())
                    .type(Notification.NotificationType.TASK_COMPLETED)
                    .recipient(task.getAssignedTo())
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    task.getAssignedTo().getEmail(),
                    "Task Completed",
                    "Task '" + task.getTitle() + "' has been marked as " + task.getStatus()
            );
        }

        // Notify all admins
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            // Skip if admin is already notified (as reporter or assignee)
            if ((task.getUser() != null && admin.getId().equals(task.getUser().getId())) ||
                (task.getAssignedTo() != null && admin.getId().equals(task.getAssignedTo().getId()))) {
                continue;
            }

            Notification notification = Notification.builder()
                    .message("Task '" + task.getTitle() + "' has been marked as " + task.getStatus())
                    .type(Notification.NotificationType.TASK_COMPLETED)
                    .recipient(admin)
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    admin.getEmail(),
                    "Task Completed",
                    "Task '" + task.getTitle() + "' has been marked as " + task.getStatus()
            );
        }
    }

    // 🔔 Notify when comment is added
    public void notifyCommentAdded(Task task, User commenter) {

        // Notify assigned developer
        if (task.getAssignedTo() != null &&
            !task.getAssignedTo().getId().equals(commenter.getId())) {

            Notification notification = Notification.builder()
                    .message(commenter.getEmail() + " commented on task: " + task.getTitle())
                    .type(Notification.NotificationType.COMMENT_ADDED)
                    .recipient(task.getAssignedTo())
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    task.getAssignedTo().getEmail(),
                    "New Comment",
                    commenter.getEmail() + " commented on task: " + task.getTitle()
            );
        }

        // Notify task creator
        if (task.getUser() != null &&
            !task.getUser().getId().equals(commenter.getId())) {

            Notification notification = Notification.builder()
                    .message(commenter.getEmail() + " commented on your task: " + task.getTitle())
                    .type(Notification.NotificationType.COMMENT_ADDED)
                    .recipient(task.getUser())
                    .task(task)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            sendEmailSafe(
                    task.getUser().getEmail(),
                    "New Comment",
                    commenter.getEmail() + " commented on your task: " + task.getTitle()
            );
        }
    }

    // ✅ SAFE EMAIL HELPER (Best Practice)
    private void sendEmailSafe(String to, String subject, String message) {
        if (to == null) return;

        try {
            emailService.sendEmail(to, subject, message);
        } catch (Exception e) {
            System.out.println("Email failed: " + subject);
        }
    }

    // 📥 Get all notifications
    public List<Notification> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    // 📥 Get unread notifications
    public List<Notification> getUnreadNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    // ✅ Mark as read
    public void markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // 🔢 Unread count
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countUnreadByRecipient(user);
    }

    // ❌ Delete notification
    public void deleteNotification(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        notificationRepository.delete(notification);
    }
}