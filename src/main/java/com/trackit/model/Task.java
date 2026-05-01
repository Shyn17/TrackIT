package com.trackit.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    // ✅ STATUS
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    // 🔥 PRIORITY
    @Enumerated(EnumType.STRING)
    private Priority priority;

    // 🔥 SEVERITY
    @Enumerated(EnumType.STRING)
    private Severity severity;

    // 👤 REPORTER (creator)
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Stored at creation time so we never need to lazy-load the user just to get the email
    @Column(name = "reporter_email")
    private String reporterEmail;

    // 👨‍💻 ASSIGNED DEVELOPER
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    // 💬 COMMENTS
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Comment> comments;

    // 📎 ATTACHMENTS
    @ElementCollection
    private List<String> attachments;

    // 📁 PROJECT
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    // ⏱ CREATED TIME
    private LocalDateTime createdAt;

    // ⏱ UPDATED TIME (🔥 FIXED)
    private LocalDateTime updatedAt;

    // ✅ AUTO SET CREATED TIME
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ AUTO UPDATE TIME (🔥 FIXED)
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ FIX for DashboardService (reportedBy) — @JsonIgnore prevents password exposure
    @com.fasterxml.jackson.annotation.JsonIgnore
    public User getReportedBy() {
        return this.user;
    }
}