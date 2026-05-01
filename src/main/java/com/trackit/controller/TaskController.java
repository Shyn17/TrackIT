package com.trackit.controller;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.trackit.dto.TaskSearchRequest;
import com.trackit.model.Task;
import com.trackit.model.TaskStatus;
import com.trackit.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /* =========================================================
       CREATE TASK — multipart only
       task part:  JSON blob with title/description/priority/severity/project
       files part: optional file attachments
       ========================================================= */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Task create(
            @RequestPart(value = "task") Task task,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            Authentication auth
    ) {
        return taskService.createTask(task, auth.getName(), files);
    }

    /* =========================================================
       GET ALL TASKS (ADMIN / REPORTER only — see SecurityConfig)
       ========================================================= */
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    /* =========================================================
       GET SINGLE TASK BY ID (any authenticated role)
       Used by IssueDetail — accessible by DEVELOPER too
       ========================================================= */
    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    /* =========================================================
       ✅ ADVANCED SEARCH (PAGINATION)
       ========================================================= */
    @PostMapping("/search")
    public Page<Task> search(
            @RequestBody TaskSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return taskService.searchTasks(request, page, size);
    }

    /* =========================================================
       ✅ MY TASKS
       ========================================================= */
    @GetMapping("/my")
    public List<Task> myTasks(Authentication auth) {
        return taskService.getMyTasks(auth.getName());
    }

    /* =========================================================
       ✅ TASKS ASSIGNED TO ME
       ========================================================= */
    @GetMapping("/assigned")
    public List<Task> assigned(Authentication auth) {
        return taskService.getTasksAssignedToMe(auth.getName());
    }

    /* =========================================================
       ✅ ASSIGN TASK (ADMIN)
       ========================================================= */
    @PutMapping("/assign")
    public Task assign(
            @RequestParam Long taskId,
            @RequestParam String devEmail
    ) {
        return taskService.assignTask(taskId, devEmail);
    }

    /* =========================================================
       ✅ UPDATE STATUS
       ========================================================= */
    @PutMapping("/status")
    public Task updateStatus(
            @RequestParam Long taskId,
            @RequestParam TaskStatus status,
            Authentication auth
    ) {
        return taskService.updateStatus(taskId, status, auth.getName());
    }

    /* =========================================================
       DELETE TASK
       ADMIN → any task | REPORTER → own tasks only (enforced in service)
       ========================================================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id, Authentication auth) {
        try {
            taskService.deleteTask(id, auth.getName());
            return ResponseEntity.ok("Deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    /* =========================================================
       ✅ DOWNLOAD ATTACHMENT
       ========================================================= */
    @GetMapping("/{taskId}/attachments/{fileName}")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable Long taskId,
            @PathVariable String fileName
    ) {
        try {
            Path filePath = Paths.get("uploads").resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + fileName + "\""
                        )
                        .body(resource);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}