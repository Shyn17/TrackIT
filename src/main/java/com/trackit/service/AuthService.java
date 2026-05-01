package com.trackit.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trackit.dto.LoginRequest;
import com.trackit.dto.LoginResponse;
import com.trackit.model.User;
import com.trackit.repository.UserRepository;
import com.trackit.security.JwtUtil;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
@Getter
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email or password missing");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

String token = jwtUtil.generateToken(
        user.getEmail(),
        user.getRole().name()
);// 🔥 pass role to token

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }

    public void register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
    }
}