package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * ProjectActivity JPA Entity.
 * 
 * WHY THIS CLASS EXISTS:
 * Logs historical activity timeline events (e.g., project created, member
 * added, status updated)
 * associated with a specific FlowForge project.
 * 
 * RELATIONSHIPS:
 * - @ManyToOne: Multiple activities belong to a single parent Project entity.
 */
@Entity
@Table(name = "project_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectActivity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "activity", nullable = false, length = 500)
    private String activity;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_avatar")
    private String userAvatar;

    @Column(name = "status_badge")
    private String statusBadge;
}
