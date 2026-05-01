package com.trackit.controller;



import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trackit.model.User;
import com.trackit.service.UserService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('DEVELOPER','REPORTER','ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public User getMyProfile(Authentication auth) {
        return userService.getByEmail(auth.getName());
    }

    @DeleteMapping("/me")
    public String deleteMyAccount(Authentication auth) {
        userService.deleteByEmail(auth.getName());
        return "Account deleted";
    }
}