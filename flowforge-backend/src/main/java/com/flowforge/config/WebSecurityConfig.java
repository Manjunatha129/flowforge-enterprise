package com.flowforge.config;

import com.flowforge.security.JwtAuthEntryPoint;
import com.flowforge.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security Configuration Class (WebSecurityConfig).
 * 
 * PURPOSE:
 * Configures application-wide web security rules, CORS policies, CSRF settings,
 * session management (stateless JWT authentication), and URL authorization rules.
 * 
 * WHO CALLS IT:
 * Spring Security automatically loads this configuration class upon backend startup.
 * 
 * ANNOTATION EXPLANATIONS:
 * - @Configuration: Indicates that this class provides Spring Bean definitions.
 * - @EnableWebSecurity: Enables Spring Security's web security support and integrates with Spring MVC.
 * - @EnableMethodSecurity: Enables method-level security annotations (like @PreAuthorize("hasRole('ADMIN')")).
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    /** Custom entry point for handling unauthorized (401) HTTP requests. */
    private final JwtAuthEntryPoint unauthorizedHandler;
    
    /** Custom JWT authentication filter executing once per request to validate Bearer tokens. */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /** Configurable allowed CORS origins loaded from application.properties / environment variables. */
    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175}")
    private String[] allowedOrigins;

    /**
     * WebSecurityConfig Constructor.
     * Injecting JwtAuthEntryPoint and JwtAuthenticationFilter dependencies.
     */
    public WebSecurityConfig(JwtAuthEntryPoint unauthorizedHandler, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * PasswordEncoder Bean Definition.
     * Provides BCrypt password hashing algorithm for secure user credential storage.
     * 
     * @return PasswordEncoder instance utilizing BCrypt hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager Bean Definition.
     * Retrieves the standard AuthenticationManager configured by Spring Security.
     * 
     * @param authConfig Spring Security AuthenticationConfiguration.
     * @return AuthenticationManager instance.
     * @throws Exception if authentication manager cannot be retrieved.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * CORS Configuration Source Bean.
     * Configures allowed HTTP methods, headers, and credentials for cross-origin requests.
     * 
     * @return CorsConfigurationSource registered for all URL paths (/**).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Main Security Filter Chain Bean.
     * 
     * WHY THIS METHOD EXISTS:
     * Defines the HTTP security policy for all incoming web requests.
     * 
     * WHAT IT DOES:
     * 1. Enables CORS using custom configuration source.
     * 2. Disables CSRF protection (since REST APIs use stateless JWT Bearer tokens).
     * 3. Configures custom unauthorized entry point for 401 Unauthorized handling.
     * 4. Enforces STATELESS session management (no HTTP session stored on server).
     * 5. Permits public access to /api/auth/** and /api/v1/auth/** endpoints without authentication.
     * 6. Permits public access to H2 console, Swagger/OpenAPI docs, Actuator, and WebSockets.
     * 7. Restricts /api/v1/admin/** endpoints to users with ADMIN role.
     * 8. Enforces authentication for all other incoming requests.
     * 9. Registers JwtAuthenticationFilter prior to UsernamePasswordAuthenticationFilter.
     * 
     * @param http HttpSecurity configuration builder.
     * @return Built SecurityFilterChain instance.
     * @throws Exception if security configuration fails.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS cross-origin resource sharing
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Disable CSRF protection for REST endpoints using stateless JWT
                .csrf(AbstractHttpConfigurer::disable)
                
                // Handle unauthorized access exceptions with custom entry point
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                
                // Ensure session creation is STATELESS (JWT based)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Configure HTTP URL authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public authentication endpoints (/api/auth/** and /api/v1/auth/**)
                        .requestMatchers("/api/auth/**", "/api/v1/auth/**", "/h2-console/**", "/v3/api-docs/**", "/swagger-ui/**",
                                "/swagger-ui.html", "/actuator/**", "/ws/**")
                        .permitAll()
                        
                        // Admin role endpoints restriction
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        
                        // All other endpoints require valid JWT authentication
                        .anyRequest().authenticated())
                
                // Configure security headers for H2 console frame options
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                        .xssProtection(xss -> xss.disable()));

        // Insert JWT validation filter before standard UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

