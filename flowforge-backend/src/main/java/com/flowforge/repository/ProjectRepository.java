package com.flowforge.repository;

import com.flowforge.entity.Project;
import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByProjectNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String desc);

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByPriority(ProjectPriority priority);

    List<Project> findByCategoryIgnoreCase(String category);

    @Query("SELECT p FROM Project p WHERE " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:priority IS NULL OR p.priority = :priority) AND " +
            "(:category IS NULL OR LOWER(p.category) = LOWER(:category))")
    List<Project> filterProjects(
            @Param("status") ProjectStatus status,
            @Param("priority") ProjectPriority priority,
            @Param("category") String category);

    long countByStatus(ProjectStatus status);
}
