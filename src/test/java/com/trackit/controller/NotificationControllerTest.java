package com.trackit.controller;

import com.trackit.model.Notification;
import com.trackit.model.Task;
import com.trackit.model.User;
import com.trackit.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificationService notificationService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private NotificationController notificationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    private Notification createTestNotification(Long id, String message) {
        User recipient = new User();
        recipient.setEmail("test@test.com");

        Task task = new Task();
        task.setId(10L);
        task.setTitle("Test Task");

        return Notification.builder()
                .id(id)
                .message(message)
                .type(Notification.NotificationType.TASK_ASSIGNED)
                .recipient(recipient)
                .task(task)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetMyNotifications() throws Exception {
        String email = "test@test.com";
        Notification notif1 = createTestNotification(1L, "Message 1");
        Notification notif2 = createTestNotification(2L, "Message 2");

        when(authentication.getName()).thenReturn(email);
        when(notificationService.getUserNotifications(email)).thenReturn(Arrays.asList(notif1, notif2));

        mockMvc.perform(get("/api/notifications").principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].message").value("Message 1"))
                .andExpect(jsonPath("$[1].message").value("Message 2"));

        verify(notificationService, times(1)).getUserNotifications(email);
    }

    @Test
    void testGetUnreadNotifications() throws Exception {
        String email = "test@test.com";
        Notification notif1 = createTestNotification(1L, "Message 1");

        when(authentication.getName()).thenReturn(email);
        when(notificationService.getUnreadNotifications(email)).thenReturn(Arrays.asList(notif1));

        mockMvc.perform(get("/api/notifications/unread").principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].message").value("Message 1"));

        verify(notificationService, times(1)).getUnreadNotifications(email);
    }

    @Test
    void testGetUnreadCount() throws Exception {
        String email = "test@test.com";

        when(authentication.getName()).thenReturn(email);
        when(notificationService.getUnreadCount(email)).thenReturn(5L);

        mockMvc.perform(get("/api/notifications/unread/count").principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(5));

        verify(notificationService, times(1)).getUnreadCount(email);
    }

    @Test
    void testMarkAsRead() throws Exception {
        String email = "test@test.com";
        Long notifId = 1L;

        when(authentication.getName()).thenReturn(email);
        doNothing().when(notificationService).markAsRead(notifId, email);

        mockMvc.perform(put("/api/notifications/{id}/read", notifId).principal(authentication))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markAsRead(notifId, email);
    }

    @Test
    void testDeleteNotification() throws Exception {
        String email = "test@test.com";
        Long notifId = 1L;

        when(authentication.getName()).thenReturn(email);
        doNothing().when(notificationService).deleteNotification(notifId, email);

        mockMvc.perform(delete("/api/notifications/{id}", notifId).principal(authentication))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).deleteNotification(notifId, email);
    }
}
