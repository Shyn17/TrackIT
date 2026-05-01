package com.trackit.controller;

import com.trackit.model.User;
import com.trackit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")        // ✅ added (ADMIN only)
public class AdminController {

    private final UserService service;   // ✅ constructor-injected

    public AdminController(UserService service) {
        this.service = service;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PostMapping("/users")
    public User create(@RequestBody User user) {
        return service.createUser(user);
    }

    @DeleteMapping("/users/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteUserById(id);      // ✅ renamed for clarity & consistency
    }
}