package com.trackit.controller;

import com.trackit.dto.LoginRequest;
import com.trackit.dto.LoginResponse;
import com.trackit.model.User;
import com.trackit.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        System.out.println("✅ LOGIN CONTROLLER HIT");
        return (LoginResponse) authService.login(request);
    }

    // ✅ ADD THIS
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        authService.register(user);
        return "User registered successfully";
    }
}