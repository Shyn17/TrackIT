package com.trackit.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trackit.model.Project;
import com.trackit.service.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Project create(@RequestBody Project project, Authentication auth) {
        return projectService.createProject(project, auth.getName());
    }

    @GetMapping
    public List<Project> getAll() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }
}