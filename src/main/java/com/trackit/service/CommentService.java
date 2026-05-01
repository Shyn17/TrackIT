package com.trackit.service;

import com.trackit.model.Comment;
import com.trackit.model.Task;
import com.trackit.model.User;
import com.trackit.repository.CommentRepository;
import com.trackit.repository.TaskRepository;
import com.trackit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Comment addComment(Long taskId, String content, String email) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
        .content(content)
        .createdAt(LocalDateTime.now())
        .task(task)
        .user(user)
        .build();
        

        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }
}