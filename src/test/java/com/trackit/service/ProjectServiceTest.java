package com.trackit.service;

import com.trackit.model.Project;
import com.trackit.model.User;
import com.trackit.repository.ProjectRepository;
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

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProjectSuccess() {
        String email = "test@test.com";
        Project project = new Project();
        project.setName("New Project");

        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(projectRepository.save(project)).thenReturn(project);

        Project savedProject = projectService.createProject(project, email);

        assertNotNull(savedProject);
        verify(userRepository, times(1)).findByEmail(email);
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void testCreateProjectUserNotFound() {
        String email = "notfound@test.com";
        Project project = new Project();

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.createProject(project, email);
        });

        assertEquals("User not found", exception.getMessage());
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void testGetAllProjects() {
        Project p1 = new Project();
        p1.setId(1L);
        Project p2 = new Project();
        p2.setId(2L);

        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Project> projects = projectService.getAllProjects();
        assertEquals(2, projects.size());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void testGetProjectByIdSuccess() {
        Long id = 1L;
        Project p = new Project();
        p.setId(id);

        when(projectRepository.findById(id)).thenReturn(Optional.of(p));

        Project result = projectService.getProjectById(id);
        assertEquals(id, result.getId());
        verify(projectRepository, times(1)).findById(id);
    }

    @Test
    void testGetProjectByIdNotFound() {
        Long id = 1L;

        when(projectRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.getProjectById(id);
        });

        assertEquals("Project not found", exception.getMessage());
    }
}
