package com.trackit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trackit.model.Notification;
import com.trackit.model.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);

    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient = :recipient AND n.isRead = false")
    long countUnreadByRecipient(@Param("recipient") User recipient);

    // Get notifications for a specific task
    List<Notification> findByTaskIdOrderByCreatedAtDesc(Long taskId);
}