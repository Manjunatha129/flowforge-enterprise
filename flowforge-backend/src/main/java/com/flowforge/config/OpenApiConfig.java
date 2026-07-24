package com.flowforge.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI 3.0 Configuration.
 * 
 * PURPOSE OF THIS CLASS:
 * Configures automated OpenAPI specification generation and Swagger UI
 * documentation (/swagger-ui.html).
 * Registers JWT Bearer Token authentication security scheme so developers can
 * authorize API calls directly from Swagger UI.
 * 
 * ANNOTATIONS EXPLAINED:
 * - @Configuration: Marks this class as a Spring configuration bean provider.
 * - @Bean: Registers the returned OpenAPI instance in the Spring Application
 * Context.
 */
@Configuration
public class OpenApiConfig {

        private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("FlowForge - Production-Ready Full-Stack Enterprise API")
                                                .description("RESTful API documentation for FlowForge Project Management Platform built with Java 21, Spring Boot 3, Spring Security, and JWT Authentication.")
                                                .version("1.0.0")
                                                .contact(new Contact()
                                                                .name("FlowForge Engineering Team")
                                                                .email("support@FlowForge.dev")
                                                                .url("https://FlowForge.dev"))
                                                .license(new License().name("MIT License")
                                                                .url("https://opensource.org/licenses/MIT")))
                                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                                .components(new Components()
                                                .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                                                new SecurityScheme()
                                                                                .name(SECURITY_SCHEME_NAME)
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")
                                                                                .description("Enter JWT Bearer token obtained from POST /api/v1/auth/login")));
        }
}
