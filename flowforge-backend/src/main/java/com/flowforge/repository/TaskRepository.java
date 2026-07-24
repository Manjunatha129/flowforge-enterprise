package com.flowforge.repository;

import com.flowforge.entity.Task;
import com.flowforge.entity.TaskPriority;
import com.flowforge.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Task Spring Data JPA Repository.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Supplies database query operations for tasks, status counts, filtering, and
 * overdue task calculations.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProjectId(UUID projectId);

    List<Task> findByStatus(TaskStatus status);

    long countByStatus(TaskStatus status);

    long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);

    long countByPriority(TaskPriority priority);

    long countByPriorityIn(Collection<TaskPriority> priorities);

    List<Task> findByPriority(TaskPriority priority);

    List<Task> findByArchivedFalse();

    @Query("SELECT t FROM Task t WHERE " +
            "(:projectId IS NULL OR t.project.id = :projectId) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:priority IS NULL OR t.priority = :priority) AND " +
            "t.archived = false")
    List<Task> filterTasks(
            @Param("projectId") UUID projectId,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority);

    List<Task> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String desc);
}
