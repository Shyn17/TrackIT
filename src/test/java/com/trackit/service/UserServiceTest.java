package com.trackit.service;

import com.trackit.model.User;
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
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userService.getAllUsers();
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testCreateUser() {
        User user = new User();
        user.setEmail("test@test.com");

        when(userRepository.save(user)).thenReturn(user);

        User savedUser = userService.createUser(user);
        assertNotNull(savedUser);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testDeleteUserById() {
        Long id = 1L;

        doNothing().when(userRepository).deleteById(id);

        userService.deleteUserById(id);

        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    void testGetByEmailSuccess() {
        String email = "test@test.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User result = userService.getByEmail(email);
        assertEquals(email, result.getEmail());
    }

    @Test
    void testGetByEmailNotFound() {
        String email = "test@test.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getByEmail(email);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testDeleteByEmail() {
        String email = "test@test.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);

        userService.deleteByEmail(email);

        verify(userRepository, times(1)).findByEmail(email);
        verify(userRepository, times(1)).delete(user);
    }
}
