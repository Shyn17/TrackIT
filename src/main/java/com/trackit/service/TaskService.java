package com.trackit.service;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trackit.dto.TaskSearchRequest;
import com.trackit.model.Task;
import com.trackit.model.TaskStatus;
import com.trackit.model.User;
import com.trackit.repository.TaskRepository;
import com.trackit.repository.UserRepository;
import com.trackit.repository.specification.TaskSpecification;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    // 🔍 ADVANCED SEARCH WITH PAGINATION
public Page<Task> searchTasks(
        TaskSearchRequest request,
        int page,
        int size
) {

    Specification<Task> spec = TaskSpecification.build(
            request.getStatus(),
            request.getPriority(),
            request.getSeverity(),
            request.getAssignedDeveloperId(),
            request.getKeyword()
    );

    Pageable pageable = PageRequest.of(page, size);
    return taskRepository.findAll(spec, pageable);
}



    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;


    // CREATE TASK (REPORTER)
    public Task createTask(Task task, String email, MultipartFile[] files) {

        if (task.getPriority() == null || task.getSeverity() == null) {
            throw new RuntimeException("Priority and Severity are required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setUser(user);
        task.setReporterEmail(user.getEmail()); // stored in DB column, no lazy-load needed
        task.setStatus(TaskStatus.OPEN);


        // Handle file uploads
        if (files != null && files.length > 0) {
            List<String> attachmentPaths = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        Path uploadPath = Paths.get("uploads");
                        if (!Files.exists(uploadPath)) {
                            Files.createDirectories(uploadPath);
                        }
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath);
                        attachmentPaths.add(fileName);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                    }
                }
            }
            task.setAttachments(attachmentPaths);
        }

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<Task> getMyTasks(String email) {
        return taskRepository.findByUserEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksAssignedToMe(String email) {
        User dev = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByAssignedTo(dev);
    }

    public Task assignTask(Long taskId, String devEmail) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User dev = userRepository.findByEmail(devEmail)
                .orElseThrow(() -> new RuntimeException("Developer not found"));

        task.setAssignedTo(dev);
        task.setStatus(TaskStatus.IN_PROGRESS);

        Task savedTask = taskRepository.save(task);
        notificationService.notifyTaskAssigned(savedTask, devEmail);

        return savedTask;
    }


    public Task updateStatus(Long taskId, TaskStatus status, String email) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (task.getAssignedTo() == null ||
            !task.getAssignedTo().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this task");
        }

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        
        // Notify when task is resolved or closed
        if (status == TaskStatus.RESOLVED || status == TaskStatus.CLOSED) {
            notificationService.notifyTaskCompleted(updatedTask);
        }
        
        return updatedTask;
    }

    public void deleteTask(Long id, String callerEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));

        User caller = userRepository.findByEmail(callerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ADMIN can delete any task
        if (caller.getRole().name().equals("ADMIN")) {
            taskRepository.deleteById(id);
            return;
        }

        // REPORTER can only delete tasks they created
        if (caller.getRole().name().equals("REPORTER")) {
            if (task.getUser() == null || !task.getUser().getId().equals(caller.getId())) {
                throw new RuntimeException("You can only delete tasks you reported.");
            }
            taskRepository.deleteById(id);
            return;
        }

        throw new RuntimeException("Not authorised to delete tasks.");
    }

    // 🔍 ADVANCED SEARCH
    public List<Task> searchTasks(TaskSearchRequest request) {

        Specification<Task> spec = TaskSpecification.build(
                request.getStatus(),
                request.getPriority(),
                request.getSeverity(),
                request.getAssignedDeveloperId(),
                request.getKeyword()
        );

        
        return taskRepository.findAll(spec);
    }
    @Transactional(readOnly = true)
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
}