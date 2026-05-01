package com.trackit.service;

import com.trackit.model.Comment;
import com.trackit.model.Task;
import com.trackit.model.User;
import com.trackit.repository.CommentRepository;
import com.trackit.repository.TaskRepository;
import com.trackit.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddCommentSuccess() {
        Long taskId = 1L;
        String email = "test@test.com";
        String content = "Test Content";

        Task task = new Task();
        task.setId(taskId);

        User user = new User();
        user.setEmail(email);

        Comment comment = new Comment();
        comment.setContent(content);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment savedComment = commentService.addComment(taskId, content, email);

        assertNotNull(savedComment);
        assertEquals(content, savedComment.getContent());

        verify(taskRepository, times(1)).findById(taskId);
        verify(userRepository, times(1)).findByEmail(email);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testAddCommentTaskNotFound() {
        Long taskId = 1L;
        String email = "test@test.com";

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            commentService.addComment(taskId, "content", email);
        });

        assertEquals("Task not found", exception.getMessage());
        verify(userRepository, never()).findByEmail(anyString());
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void testAddCommentUserNotFound() {
        Long taskId = 1L;
        String email = "test@test.com";

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(new Task()));
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            commentService.addComment(taskId, "content", email);
        });

        assertEquals("User not found", exception.getMessage());
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void testGetComments() {
        Long taskId = 1L;
        Comment c1 = new Comment();
        c1.setId(1L);
        Comment c2 = new Comment();
        c2.setId(2L);

        when(commentRepository.findByTaskId(taskId)).thenReturn(Arrays.asList(c1, c2));

        List<Comment> comments = commentService.getComments(taskId);
        assertEquals(2, comments.size());
        verify(commentRepository, times(1)).findByTaskId(taskId);
    }
}
