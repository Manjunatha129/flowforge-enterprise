package com.flowforge.repository;

import com.flowforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * User JPA Data Repository Interface (UserRepository).
 * 
 * PURPOSE:
 * Provides CRUD and custom database query methods for User entities.
 * 
 * ANNOTATION EXPLANATION:
 * - @Repository: Marks this interface as a Spring Data repository component.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /** Find user by exact email address. */
    Optional<User> findByEmail(String email);

    /** Find user by email address or display name/username. */
    Optional<User> findByEmailOrName(String email, String name);

    /** Check if a user with the given email exists in database. */
    Boolean existsByEmail(String email);

    /** Search users by name or email case-insensitively for search autocompletion. */
    java.util.List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}

