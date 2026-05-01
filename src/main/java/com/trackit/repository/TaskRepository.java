package com.trackit.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.trackit.model.Task;
import com.trackit.model.TaskStatus;
import com.trackit.model.User;

public interface TaskRepository
        extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByUserEmail(String email);
    List<Task> findByAssignedToEmail(String email);
    List<Task> findByAssignedTo(User dev);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByUserId(Long reporterId);
    List<Task> findByAssignedToId(Long developerId);

    // 📊 Tasks by status (used for open tasks in dashboard)
    List<Task> findByStatus(TaskStatus status);

    // 🕐 Recently updated tasks (for activity feed)
    @Query("SELECT t FROM Task t WHERE t.updatedAt IS NOT NULL ORDER BY t.updatedAt DESC")
    List<Task> findRecentlyUpdatedTasks(Pageable pageable);

    // 📊 Total bugs
    @Query("SELECT COUNT(t) FROM Task t")
    long countTotalTasks();

    // 📈 Bugs grouped by status
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> countTasksByStatus();

    // ✅ Completed bugs
    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.status = com.trackit.model.TaskStatus.RESOLVED
           OR t.status = com.trackit.model.TaskStatus.CLOSED
    """)
    long countCompletedTasks();
}