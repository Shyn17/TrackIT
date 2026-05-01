package com.trackit.service;

import com.trackit.model.User;
import com.trackit.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User createUser(User user) {
        return repo.save(user);
    }

    // ADMIN delete
    public void deleteUserById(Long id) {
        repo.deleteById(id);
    }

    // SELF actions
    public User getByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteByEmail(String email) {
        repo.delete(getByEmail(email));
    }
}