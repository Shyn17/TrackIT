package com.trackit;

import com.trackit.controller.*;
import com.trackit.service.*;
import com.trackit.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TrackitApplicationTests {

    @Autowired
    private AuthController authController;

    @Autowired
    private TaskController taskController;

    @Autowired
    private ProjectController projectController;

    @Autowired
    private UserController userController;

    @Autowired
    private DashboardController dashboardController;

    @Autowired
    private AuthService authService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void contextLoads() {
        // This test will fail if the Spring application context cannot start successfully.
        // It serves as a great sanity check for all beans and configurations.
    }

    @Test
    void controllersAreLoaded() {
        assertThat(authController).isNotNull();
        assertThat(taskController).isNotNull();
        assertThat(projectController).isNotNull();
        assertThat(userController).isNotNull();
        assertThat(dashboardController).isNotNull();
    }

    @Test
    void servicesAreLoaded() {
        assertThat(authService).isNotNull();
        assertThat(taskService).isNotNull();
        assertThat(projectService).isNotNull();
        assertThat(userService).isNotNull();
    }

    @Test
    void repositoriesAreLoaded() {
        assertThat(taskRepository).isNotNull();
        assertThat(userRepository).isNotNull();
        assertThat(projectRepository).isNotNull();
    }
}
