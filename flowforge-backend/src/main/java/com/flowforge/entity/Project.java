package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Project JPA Entity mapped to the "projects" MySQL database table.
 * 
 * WHY THIS CLASS EXISTS:
 * Represents a workspace project entity storing metadata, status, progress,
 * dates,
 * custom cover color, task counters, and team members.
 */
@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category")
    @Builder.Default
    private String category = "Engineering";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private ProjectPriority priority = ProjectPriority.MEDIUM;

    @Column(name = "project_color")
    @Builder.Default
    private String projectColor = "#0c93e7"; // Default FlowForge brand blue hex

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "progress")
    @Builder.Default
    private int progress = 0; // 0 to 100%

    @Column(name = "total_tasks")
    @Builder.Default
    private int totalTasks = 0;

    @Column(name = "completed_tasks")
    @Builder.Default
    private int completedTasks = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_members", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "member_avatar")
    @Builder.Default
    private List<String> members = new ArrayList<>();

    @Column(name = "created_by")
    private String createdBy;
}
