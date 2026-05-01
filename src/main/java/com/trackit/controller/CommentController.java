package com.trackit.controller;

import com.trackit.dto.CommentRequest;
import com.trackit.model.Comment;
import com.trackit.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ADD COMMENT
    @PostMapping
    public Comment addComment(
            @PathVariable Long taskId,
            @RequestBody CommentRequest request,
            Authentication auth
    ) {
        return commentService.addComment(
                taskId,
                request.getContent(),
                auth.getName()
        );
    }

    // GET COMMENTS
    @GetMapping
    public List<Comment> getComments(@PathVariable Long taskId) {
        return commentService.getComments(taskId);
    }
}