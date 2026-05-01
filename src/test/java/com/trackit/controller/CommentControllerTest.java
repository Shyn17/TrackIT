package com.trackit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trackit.dto.CommentRequest;
import com.trackit.model.Comment;
import com.trackit.service.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CommentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CommentService commentService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CommentController commentController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(commentController).build();
    }

    @Test
    void testAddComment() throws Exception {
        Long taskId = 1L;
        String email = "test@test.com";
        String content = "Test Comment";

        CommentRequest request = new CommentRequest();
        request.setContent(content);

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent(content);

        when(authentication.getName()).thenReturn(email);
        when(commentService.addComment(eq(taskId), eq(content), eq(email))).thenReturn(comment);

        mockMvc.perform(post("/tasks/{taskId}/comments", taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.content").value(content));

        verify(commentService, times(1)).addComment(eq(taskId), eq(content), eq(email));
    }

    @Test
    void testGetComments() throws Exception {
        Long taskId = 1L;
        
        Comment comment1 = new Comment();
        comment1.setId(1L);
        comment1.setContent("Comment 1");

        Comment comment2 = new Comment();
        comment2.setId(2L);
        comment2.setContent("Comment 2");

        List<Comment> comments = Arrays.asList(comment1, comment2);

        when(commentService.getComments(taskId)).thenReturn(comments);

        mockMvc.perform(get("/tasks/{taskId}/comments", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].content").value("Comment 1"))
                .andExpect(jsonPath("$[1].content").value("Comment 2"));

        verify(commentService, times(1)).getComments(taskId);
    }
}
