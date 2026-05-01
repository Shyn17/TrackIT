package com.trackit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trackit.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}