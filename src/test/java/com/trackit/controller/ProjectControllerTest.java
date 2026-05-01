package com.trackit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trackit.model.Project;
import com.trackit.service.ProjectService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProjectControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjectService projectService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProjectController projectController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(projectController).build();
    }

    @Test
    void testCreateProject() throws Exception {
        String email = "admin@test.com";
        Project project = new Project();
        project.setName("New Project");

        Project savedProject = new Project();
        savedProject.setId(1L);
        savedProject.setName("New Project");

        when(authentication.getName()).thenReturn(email);
        when(projectService.createProject(any(Project.class), eq(email))).thenReturn(savedProject);

        mockMvc.perform(post("/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(project))
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("New Project"));

        verify(projectService, times(1)).createProject(any(Project.class), eq(email));
    }

    @Test
    void testGetAllProjects() throws Exception {
        Project project1 = new Project();
        project1.setId(1L);
        project1.setName("Project 1");

        Project project2 = new Project();
        project2.setId(2L);
        project2.setName("Project 2");

        List<Project> projects = Arrays.asList(project1, project2);

        when(projectService.getAllProjects()).thenReturn(projects);

        mockMvc.perform(get("/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Project 1"))
                .andExpect(jsonPath("$[1].name").value("Project 2"));

        verify(projectService, times(1)).getAllProjects();
    }

    @Test
    void testGetProjectById() throws Exception {
        Long projectId = 1L;
        Project project = new Project();
        project.setId(projectId);
        project.setName("Project 1");

        when(projectService.getProjectById(projectId)).thenReturn(project);

        mockMvc.perform(get("/projects/{id}", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.name").value("Project 1"));

        verify(projectService, times(1)).getProjectById(projectId);
    }
}
