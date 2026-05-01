package com.trackit.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.trackit.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTaskId(Long taskId);

    // Fetch N most-recent comments across all tasks
    @Query("SELECT c FROM Comment c WHERE c.createdAt IS NOT NULL ORDER BY c.createdAt DESC")
    List<Comment> findRecentComments(Pageable pageable);
}