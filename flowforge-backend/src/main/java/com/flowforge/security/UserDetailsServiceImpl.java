package com.flowforge.security;

import com.flowforge.entity.User;
import com.flowforge.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security UserDetailsService Implementation (UserDetailsServiceImpl).
 * 
 * PURPOSE:
 * Loads user authentication details from the database during authentication filter chain processing.
 * Supports user resolution via email address or username (display name).
 * 
 * ANNOTATION EXPLANATION:
 * - @Service: Marks this class as a Spring Service component for dependency injection.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /** Constructor Injection for UserRepository. */
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads UserDetails instance by email address or display name/username.
     * 
     * @param usernameOrEmail The user's email address or username passed in login credentials.
     * @return UserDetails object containing user authorities, credentials, and account flags.
     * @throws UsernameNotFoundException if user is not found in database.
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrName(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + usernameOrEmail));

        return UserDetailsImpl.build(user);
    }
}
