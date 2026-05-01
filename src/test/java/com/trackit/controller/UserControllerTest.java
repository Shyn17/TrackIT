package com.trackit.controller;

import com.trackit.model.User;
import com.trackit.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void testGetMyProfile() throws Exception {
        String email = "test@test.com";
        User user = new User();
        user.setEmail(email);

        when(authentication.getName()).thenReturn(email);
        when(userService.getByEmail(email)).thenReturn(user);

        mockMvc.perform(get("/users/me").principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));

        verify(userService, times(1)).getByEmail(email);
    }

    @Test
    void testDeleteMyAccount() throws Exception {
        String email = "test@test.com";

        when(authentication.getName()).thenReturn(email);
        doNothing().when(userService).deleteByEmail(email);

        mockMvc.perform(delete("/users/me").principal(authentication))
                .andExpect(status().isOk())
                .andExpect(content().string("Account deleted"));

        verify(userService, times(1)).deleteByEmail(email);
    }
}
