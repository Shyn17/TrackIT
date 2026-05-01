package com.trackit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trackit.dto.TaskSearchRequest;
import com.trackit.model.Task;
import com.trackit.model.TaskStatus;
import com.trackit.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TaskService taskService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TaskController taskController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
    }

    @Test
    void testGetAllTasks() throws Exception {
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");

        when(taskService.getAllTasks()).thenReturn(Arrays.asList(task1, task2));

        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Task 1"));

        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    void testGetById() throws Exception {
        Long taskId = 1L;
        Task task = new Task();
        task.setId(taskId);
        task.setTitle("Task 1");

        when(taskService.getTaskById(taskId)).thenReturn(task);

        mockMvc.perform(get("/tasks/{id}", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.title").value("Task 1"));

        verify(taskService, times(1)).getTaskById(taskId);
    }

    @Test
    void testSearch() throws Exception {
        TaskSearchRequest searchRequest = new TaskSearchRequest();
        searchRequest.setKeyword("Task 1");

        Task task = new Task();
        task.setId(1L);
        task.setTitle("Task 1");
        
        Page<Task> page = new PageImpl<>(Arrays.asList(task));

        when(taskService.searchTasks(any(TaskSearchRequest.class), eq(0), eq(10))).thenReturn(page);

        Page<Task> result = taskController.search(searchRequest, 0, 10);
        
        org.junit.jupiter.api.Assertions.assertEquals(1, result.getContent().size());
        org.junit.jupiter.api.Assertions.assertEquals("Task 1", result.getContent().get(0).getTitle());

        verify(taskService, times(1)).searchTasks(any(TaskSearchRequest.class), eq(0), eq(10));
    }

    @Test
    void testMyTasks() throws Exception {
        String email = "test@test.com";
        Task task = new Task();
        task.setId(1L);

        when(authentication.getName()).thenReturn(email);
        when(taskService.getMyTasks(email)).thenReturn(Arrays.asList(task));

        mockMvc.perform(get("/tasks/my").principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        verify(taskService, times(1)).getMyTasks(email);
    }

    @Test
    void testUpdateStatus() throws Exception {
        String email = "test@test.com";
        Long taskId = 1L;
        TaskStatus status = TaskStatus.IN_PROGRESS;

        Task task = new Task();
        task.setId(taskId);
        task.setStatus(status);

        when(authentication.getName()).thenReturn(email);
        when(taskService.updateStatus(taskId, status, email)).thenReturn(task);

        mockMvc.perform(put("/tasks/status")
                .param("taskId", taskId.toString())
                .param("status", status.name())
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(status.name()));

        verify(taskService, times(1)).updateStatus(taskId, status, email);
    }

    @Test
    void testDelete() throws Exception {
        String email = "test@test.com";
        Long taskId = 1L;

        when(authentication.getName()).thenReturn(email);
        doNothing().when(taskService).deleteTask(taskId, email);

        mockMvc.perform(delete("/tasks/{id}", taskId).principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value("Deleted"));

        verify(taskService, times(1)).deleteTask(taskId, email);
    }
}
