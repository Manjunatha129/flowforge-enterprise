package com.flowforge.config;

import com.flowforge.entity.*;
import com.flowforge.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Demo Data Seeder Component.
 * 
 * PURPOSE OF THIS CLASS:
 * Automatically seeds a realistic enterprise demo dataset into the database on application startup if users do not exist.
 * Populates real Users, Projects, Tasks across Kanban columns, Team Chat messages, Direct Messages,
 * System Notifications, Activity Feeds, Comments, and File Attachments using standard Spring Data JPA Repositories.
 * 
 * ANNOTATIONS EXPLAINED:
 * - @Component: Registers this class as a Spring-managed bean.
 * - CommandLineRunner: Spring Boot interface that automatically executes the run() method after application startup.
 */
@Component
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationRepository notificationRepository;
    private final ProjectActivityRepository projectActivityRepository;
    private final UnifiedCommentRepository unifiedCommentRepository;
    private final FileAttachmentRepository fileAttachmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            ChatMessageRepository chatMessageRepository,
            NotificationRepository notificationRepository,
            ProjectActivityRepository projectActivityRepository,
            UnifiedCommentRepository unifiedCommentRepository,
            FileAttachmentRepository fileAttachmentRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.notificationRepository = notificationRepository;
        this.projectActivityRepository = projectActivityRepository;
        this.unifiedCommentRepository = unifiedCommentRepository;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Executes demo data seeding logic after Spring application context initializes.
     * Checks if demo users exist to prevent duplicate data insertion.
     */
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("manju@flowforge.com").isPresent()) {
            return; // Demo data already initialized
        }

        // --- 1. CREATE DEMO USERS ---
        User manju = User.builder()
                .name("Manju")
                .email("manju@flowforge.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .designation("Project Manager")
                .department("Product Engineering")
                .location("Bangalore, India")
                .bio("Engineering Project Lead managing enterprise software delivery.")
                .lastLoginAt(LocalDateTime.now())
                .build();

        User rahul = User.builder()
                .name("Rahul")
                .email("rahul@flowforge.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_USER)
                .enabled(true)
                .designation("Full Stack Developer")
                .department("Engineering")
                .location("Bangalore, India")
                .bio("Passionate React and Spring Boot full stack engineer.")
                .lastLoginAt(LocalDateTime.now().minusHours(2))
                .build();

        User priya = User.builder()
                .name("Priya")
                .email("priya@flowforge.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_USER)
                .enabled(true)
                .designation("Backend Developer")
                .department("Core API Engineering")
                .location("Bangalore, India")
                .bio("Specialist in Java 21, JPA, MySQL, and microservices architecture.")
                .lastLoginAt(LocalDateTime.now().minusHours(1))
                .build();

        User teju = User.builder()
                .name("Teju")
                .email("teju@flowforge.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_USER)
                .enabled(true)
                .designation("QA Engineer")
                .department("Quality Assurance")
                .location("Bangalore, India")
                .bio("Lead Quality Assurance Automation & Performance Testing Specialist.")
                .lastLoginAt(LocalDateTime.now().minusHours(3))
                .build();

        User akash = User.builder()
                .name("Akash")
                .email("akash@flowforge.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_USER)
                .enabled(true)
                .designation("Software Test Engineer")
                .department("Quality Assurance")
                .location("Bangalore, India")
                .bio("Software testing and automated end-to-end integration engineer.")
                .lastLoginAt(LocalDateTime.now().minusHours(4))
                .build();

        userRepository.saveAll(Arrays.asList(manju, rahul, priya, teju, akash));

        // --- 2. CREATE PROJECTS ---
        Project smsProject = Project.builder()
                .projectName("Student Management System")
                .description("Comprehensive student records, attendance tracking, result management, and academic administration system.")
                .category("Education")
                .priority(ProjectPriority.HIGH)
                .status(ProjectStatus.ACTIVE)
                .projectColor("#3b82f6")
                .startDate(LocalDate.now().minusDays(15))
                .dueDate(LocalDate.now().plusDays(45))
                .members(new ArrayList<>(Arrays.asList("Manju", "Rahul", "Priya", "Akash", "Teju")))
                .createdBy("manju@flowforge.com")
                .progress(45)
                .totalTasks(8)
                .completedTasks(2)
                .build();

        Project resumeProject = Project.builder()
                .projectName("ResumeCraft")
                .description("Interactive drag-and-drop resume builder with modern ATS-friendly templates and real-time PDF generation.")
                .category("Web Application")
                .priority(ProjectPriority.HIGH)
                .status(ProjectStatus.ACTIVE)
                .projectColor("#10b981")
                .startDate(LocalDate.now().minusDays(10))
                .dueDate(LocalDate.now().plusDays(30))
                .members(new ArrayList<>(Arrays.asList("Manju", "Rahul")))
                .createdBy("manju@flowforge.com")
                .progress(60)
                .totalTasks(4)
                .completedTasks(1)
                .build();

        Project trackProject = Project.builder()
                .projectName("StudentTrack")
                .description("Enterprise Spring Boot student lifecycle tracking and performance analytics engine.")
                .category("Enterprise Application")
                .priority(ProjectPriority.MEDIUM)
                .status(ProjectStatus.ACTIVE)
                .projectColor("#8b5cf6")
                .startDate(LocalDate.now().minusDays(8))
                .dueDate(LocalDate.now().plusDays(25))
                .members(new ArrayList<>(Arrays.asList("Rahul", "Priya")))
                .createdBy("rahul@flowforge.com")
                .progress(50)
                .totalTasks(4)
                .completedTasks(1)
                .build();

        Project urlProject = Project.builder()
                .projectName("URL Shortener")
                .description("High-performance URL shortening service with click analytics, custom alias generation, and QR code support.")
                .category("Utility")
                .priority(ProjectPriority.MEDIUM)
                .status(ProjectStatus.ACTIVE)
                .projectColor("#f59e0b")
                .startDate(LocalDate.now().minusDays(5))
                .dueDate(LocalDate.now().plusDays(20))
                .members(new ArrayList<>(Arrays.asList("Priya", "Akash", "Teju")))
                .createdBy("priya@flowforge.com")
                .progress(40)
                .totalTasks(4)
                .completedTasks(1)
                .build();

        projectRepository.saveAll(Arrays.asList(smsProject, resumeProject, trackProject, urlProject));

        // --- 3. CREATE TASKS ACROSS KANBAN COLUMNS ---
        List<Task> tasks = Arrays.asList(
                // Student Management System Tasks
                Task.builder()
                        .title("Login Module")
                        .description("Implement user authentication and role-based login redirect for students and faculty.")
                        .status(TaskStatus.COMPLETED)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(14))
                        .dueDate(LocalDate.now().minusDays(2))
                        .estimatedHours(16.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend", "Feature")))
                        .build(),
                Task.builder()
                        .title("Database Design")
                        .description("Design relational schemas for students, courses, attendance, and exam marks.")
                        .status(TaskStatus.COMPLETED)
                        .priority(TaskPriority.CRITICAL)
                        .startDate(LocalDate.now().minusDays(14))
                        .dueDate(LocalDate.now().minusDays(5))
                        .estimatedHours(12.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Database", "Architecture")))
                        .build(),
                Task.builder()
                        .title("Student CRUD API")
                        .description("Develop REST endpoints for adding, updating, retrieving, and archiving student records.")
                        .status(TaskStatus.IN_PROGRESS)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(4))
                        .dueDate(LocalDate.now().plusDays(5))
                        .estimatedHours(20.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend", "API")))
                        .build(),
                Task.builder()
                        .title("JWT Authentication")
                        .description("Secure endpoints with Spring Security 6 stateless JWT tokens and CORS validation.")
                        .status(TaskStatus.IN_PROGRESS)
                        .priority(TaskPriority.CRITICAL)
                        .startDate(LocalDate.now().minusDays(3))
                        .dueDate(LocalDate.now().plusDays(3))
                        .estimatedHours(14.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend", "Security")))
                        .build(),
                Task.builder()
                        .title("Attendance Module")
                        .description("Build daily student attendance recording component with bulk status updates.")
                        .status(TaskStatus.TODO)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now())
                        .dueDate(LocalDate.now().plusDays(10))
                        .estimatedHours(18.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Feature", "UI")))
                        .build(),
                Task.builder()
                        .title("Result Module")
                        .description("Implement exam grade calculation, SGPA/CGPA evaluation, and report card generator.")
                        .status(TaskStatus.BACKLOG)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now().plusDays(5))
                        .dueDate(LocalDate.now().plusDays(20))
                        .estimatedHours(24.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend", "Feature")))
                        .build(),
                Task.builder()
                        .title("Unit Testing")
                        .description("Write JUnit 5 test suites for controllers, service layers, and validation rules.")
                        .status(TaskStatus.REVIEW)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(2))
                        .dueDate(LocalDate.now().plusDays(2))
                        .estimatedHours(16.0)
                        .assignedUser("Akash")
                        .assignedUserAvatar("AK")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("Testing")))
                        .build(),
                Task.builder()
                        .title("Deployment")
                        .description("Configure Docker multi-stage build and deploy containerized stack to production server.")
                        .status(TaskStatus.BACKLOG)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().plusDays(15))
                        .dueDate(LocalDate.now().plusDays(30))
                        .estimatedHours(12.0)
                        .assignedUser("Manju")
                        .assignedUserAvatar("MJ")
                        .project(smsProject)
                        .labels(new ArrayList<>(Arrays.asList("DevOps")))
                        .build(),

                // ResumeCraft Tasks
                Task.builder()
                        .title("Resume Builder UI")
                        .description("Design interactive live preview layout with drag-and-drop section reordering.")
                        .status(TaskStatus.IN_PROGRESS)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(5))
                        .dueDate(LocalDate.now().plusDays(5))
                        .estimatedHours(22.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(resumeProject)
                        .labels(new ArrayList<>(Arrays.asList("UI", "Feature")))
                        .build(),
                Task.builder()
                        .title("PDF Generator")
                        .description("Convert React HTML canvas into high-resolution downloadable PDF resumes.")
                        .status(TaskStatus.REVIEW)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(3))
                        .dueDate(LocalDate.now().plusDays(2))
                        .estimatedHours(16.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(resumeProject)
                        .labels(new ArrayList<>(Arrays.asList("Feature")))
                        .build(),
                Task.builder()
                        .title("Authentication")
                        .description("Implement user sign up, template saving, and resume history persistence.")
                        .status(TaskStatus.COMPLETED)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now().minusDays(9))
                        .dueDate(LocalDate.now().minusDays(1))
                        .estimatedHours(10.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(resumeProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend")))
                        .build(),
                Task.builder()
                        .title("Theme Switcher")
                        .description("Provide customizable color themes (Emerald, Royal Blue, Modern Dark) for template styling.")
                        .status(TaskStatus.TODO)
                        .priority(TaskPriority.LOW)
                        .startDate(LocalDate.now())
                        .dueDate(LocalDate.now().plusDays(8))
                        .estimatedHours(8.0)
                        .assignedUser("Manju")
                        .assignedUserAvatar("MJ")
                        .project(resumeProject)
                        .labels(new ArrayList<>(Arrays.asList("UI")))
                        .build(),

                // StudentTrack Tasks
                Task.builder()
                        .title("REST APIs")
                        .description("Expose Spring Boot CRUD endpoints for student activity tracking.")
                        .status(TaskStatus.COMPLETED)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(7))
                        .dueDate(LocalDate.now().minusDays(2))
                        .estimatedHours(14.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(trackProject)
                        .labels(new ArrayList<>(Arrays.asList("API")))
                        .build(),
                Task.builder()
                        .title("Spring Security")
                        .description("Configure role authorizations and method-level security for administration APIs.")
                        .status(TaskStatus.IN_PROGRESS)
                        .priority(TaskPriority.CRITICAL)
                        .startDate(LocalDate.now().minusDays(2))
                        .dueDate(LocalDate.now().plusDays(4))
                        .estimatedHours(12.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(trackProject)
                        .labels(new ArrayList<>(Arrays.asList("Security")))
                        .build(),
                Task.builder()
                        .title("Dashboard")
                        .description("Create real-time productivity statistics cards and attendance breakdown charts.")
                        .status(TaskStatus.TODO)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now())
                        .dueDate(LocalDate.now().plusDays(9))
                        .estimatedHours(16.0)
                        .assignedUser("Rahul")
                        .assignedUserAvatar("RH")
                        .project(trackProject)
                        .labels(new ArrayList<>(Arrays.asList("UI")))
                        .build(),
                Task.builder()
                        .title("Reports")
                        .description("Generate monthly student progress PDF and Excel exports.")
                        .status(TaskStatus.BACKLOG)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now().plusDays(4))
                        .dueDate(LocalDate.now().plusDays(15))
                        .estimatedHours(14.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(trackProject)
                        .labels(new ArrayList<>(Arrays.asList("Feature")))
                        .build(),

                // URL Shortener Tasks
                Task.builder()
                        .title("Generate Short URL")
                        .description("Implement Base62 encoding algorithm to generate unique 6-character short link aliases.")
                        .status(TaskStatus.COMPLETED)
                        .priority(TaskPriority.HIGH)
                        .startDate(LocalDate.now().minusDays(4))
                        .dueDate(LocalDate.now().minusDays(1))
                        .estimatedHours(10.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(urlProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend")))
                        .build(),
                Task.builder()
                        .title("Analytics")
                        .description("Track click counters, referrer domains, and geographic access metrics.")
                        .status(TaskStatus.IN_PROGRESS)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now().minusDays(1))
                        .dueDate(LocalDate.now().plusDays(5))
                        .estimatedHours(14.0)
                        .assignedUser("Priya")
                        .assignedUserAvatar("PR")
                        .project(urlProject)
                        .labels(new ArrayList<>(Arrays.asList("Feature")))
                        .build(),
                Task.builder()
                        .title("QR Code")
                        .description("Generate high-resolution PNG QR codes for instant mobile scanning of short URLs.")
                        .status(TaskStatus.TODO)
                        .priority(TaskPriority.LOW)
                        .startDate(LocalDate.now())
                        .dueDate(LocalDate.now().plusDays(6))
                        .estimatedHours(6.0)
                        .assignedUser("Akash")
                        .assignedUserAvatar("AK")
                        .project(urlProject)
                        .labels(new ArrayList<>(Arrays.asList("Feature")))
                        .build(),
                Task.builder()
                        .title("Expiration Support")
                        .description("Allow setting TTL expiration dates on short links with automatic database cleanup.")
                        .status(TaskStatus.BACKLOG)
                        .priority(TaskPriority.MEDIUM)
                        .startDate(LocalDate.now().plusDays(3))
                        .dueDate(LocalDate.now().plusDays(12))
                        .estimatedHours(8.0)
                        .assignedUser("Teju")
                        .assignedUserAvatar("TJ")
                        .project(urlProject)
                        .labels(new ArrayList<>(Arrays.asList("Backend")))
                        .build()
        );

        taskRepository.saveAll(tasks);

        // --- 4. TEAM CHAT CONVERSATIONS ---
        List<ChatMessage> chatMessages = Arrays.asList(
                // General Workspace Chat
                ChatMessage.builder()
                        .senderEmail("manju@flowforge.com")
                        .senderName("Manju")
                        .senderAvatar("MJ")
                        .channelType("WORKSPACE")
                        .content("Good morning team! Hope everyone is doing great.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("rahul@flowforge.com")
                        .senderName("Rahul")
                        .senderAvatar("RH")
                        .channelType("WORKSPACE")
                        .content("Good morning Manju! All set for today's development tasks.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("priya@flowforge.com")
                        .senderName("Priya")
                        .senderAvatar("PR")
                        .channelType("WORKSPACE")
                        .content("Good morning everyone. Daily stand-up meeting at 10 AM.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("manju@flowforge.com")
                        .senderName("Manju")
                        .senderAvatar("MJ")
                        .channelType("WORKSPACE")
                        .content("Please update today's progress in your respective project channels before stand-up.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com")))
                        .build(),

                // Student Management System Project Channel
                ChatMessage.builder()
                        .senderEmail("rahul@flowforge.com")
                        .senderName("Rahul")
                        .senderAvatar("RH")
                        .channelType("PROJECT")
                        .projectId(smsProject.getId().toString())
                        .content("Login API completed and tested with Spring Security 6.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("priya@flowforge.com")
                        .senderName("Priya")
                        .senderAvatar("PR")
                        .channelType("PROJECT")
                        .projectId(smsProject.getId().toString())
                        .content("Database schema updated with foreign key indexes for student records.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("akash@flowforge.com")
                        .senderName("Akash")
                        .senderAvatar("AK")
                        .channelType("PROJECT")
                        .projectId(smsProject.getId().toString())
                        .content("Testing started. Test suites passing for Auth endpoints.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("manju@flowforge.com")
                        .senderName("Manju")
                        .senderAvatar("MJ")
                        .channelType("PROJECT")
                        .projectId(smsProject.getId().toString())
                        .content("Great progress team! Please finish student CRUD API before Friday.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com")))
                        .build(),

                // ResumeCraft Project Channel
                ChatMessage.builder()
                        .senderEmail("rahul@flowforge.com")
                        .senderName("Rahul")
                        .senderAvatar("RH")
                        .channelType("PROJECT")
                        .projectId(resumeProject.getId().toString())
                        .content("Discussion about PDF generation engine using HTML canvas rendering.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("manju@flowforge.com")
                        .senderName("Manju")
                        .senderAvatar("MJ")
                        .channelType("PROJECT")
                        .projectId(resumeProject.getId().toString())
                        .content("Theme improvements and responsive design look clean!")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com")))
                        .build(),

                // StudentTrack Project Channel
                ChatMessage.builder()
                        .senderEmail("priya@flowforge.com")
                        .senderName("Priya")
                        .senderAvatar("PR")
                        .channelType("PROJECT")
                        .projectId(trackProject.getId().toString())
                        .content("Spring Boot REST APIs drafted for student tracking.")
                        .readBy(new ArrayList<>(Arrays.asList("rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("rahul@flowforge.com")
                        .senderName("Rahul")
                        .senderAvatar("RH")
                        .channelType("PROJECT")
                        .projectId(trackProject.getId().toString())
                        .content("Configuring JWT Security filter chain and method authorization.")
                        .readBy(new ArrayList<>(Arrays.asList("rahul@flowforge.com", "priya@flowforge.com")))
                        .build(),

                // URL Shortener Project Channel
                ChatMessage.builder()
                        .senderEmail("priya@flowforge.com")
                        .senderName("Priya")
                        .senderAvatar("PR")
                        .channelType("PROJECT")
                        .projectId(urlProject.getId().toString())
                        .content("Short URL Base62 encoding logic implemented.")
                        .readBy(new ArrayList<>(Arrays.asList("priya@flowforge.com", "teju@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("teju@flowforge.com")
                        .senderName("Teju")
                        .senderAvatar("TJ")
                        .channelType("PROJECT")
                        .projectId(urlProject.getId().toString())
                        .content("Testing analytics click tracking and expiration support.")
                        .readBy(new ArrayList<>(Arrays.asList("priya@flowforge.com", "teju@flowforge.com")))
                        .build(),

                // Direct Messages (Rahul -> Manju)
                ChatMessage.builder()
                        .senderEmail("rahul@flowforge.com")
                        .senderName("Rahul")
                        .senderAvatar("RH")
                        .recipientEmail("manju@flowforge.com")
                        .channelType("DIRECT")
                        .content("Please review my code for the Login Module pull request.")
                        .readBy(new ArrayList<>(Arrays.asList("rahul@flowforge.com", "manju@flowforge.com")))
                        .build(),
                ChatMessage.builder()
                        .senderEmail("manju@flowforge.com")
                        .senderName("Manju")
                        .senderAvatar("MJ")
                        .recipientEmail("rahul@flowforge.com")
                        .channelType("DIRECT")
                        .content("Looks good! Clean implementation with Spring Security 6. Merge it.")
                        .readBy(new ArrayList<>(Arrays.asList("manju@flowforge.com", "rahul@flowforge.com")))
                        .build(),

                // Direct Messages (Priya -> Akash)
                ChatMessage.builder()
                        .senderEmail("priya@flowforge.com")
                        .senderName("Priya")
                        .senderAvatar("PR")
                        .recipientEmail("akash@flowforge.com")
                        .channelType("DIRECT")
                        .content("Testing environment is ready for Student CRUD API validation.")
                        .readBy(new ArrayList<>(Arrays.asList("priya@flowforge.com", "akash@flowforge.com")))
                        .build()
        );

        chatMessageRepository.saveAll(chatMessages);

        // --- 5. SYSTEM NOTIFICATIONS ---
        List<Notification> notifications = Arrays.asList(
                Notification.builder()
                        .title("New Project Created")
                        .message("Manju initialized Student Management System workspace project.")
                        .icon("folder-plus")
                        .type(NotificationType.PROJECT_CREATED)
                        .priority(NotificationPriority.HIGH)
                        .readStatus(false)
                        .sender("Manju")
                        .receiver("rahul@flowforge.com")
                        .build(),
                Notification.builder()
                        .title("Task Assigned: Login Module")
                        .message("You have been assigned to Login Module in Student Management System.")
                        .icon("check-circle")
                        .type(NotificationType.TASK_ASSIGNED)
                        .priority(NotificationPriority.HIGH)
                        .readStatus(false)
                        .sender("Manju")
                        .receiver("rahul@flowforge.com")
                        .build(),
                Notification.builder()
                        .title("Task Completed: Database Design")
                        .message("Priya marked Database Design as COMPLETED.")
                        .icon("check-circle")
                        .type(NotificationType.TASK_COMPLETED)
                        .priority(NotificationPriority.MEDIUM)
                        .readStatus(true)
                        .sender("Priya")
                        .receiver("manju@flowforge.com")
                        .build(),
                Notification.builder()
                        .title("Mentioned in Chat")
                        .message("Rahul mentioned you in #general-workspace: Please review my code.")
                        .icon("message-square")
                        .type(NotificationType.USER_MENTIONED)
                        .priority(NotificationPriority.HIGH)
                        .readStatus(false)
                        .sender("Rahul")
                        .receiver("manju@flowforge.com")
                        .build()
        );

        notificationRepository.saveAll(notifications);

        // --- 6. WORKSPACE ACTIVITY FEED ---
        List<ProjectActivity> activities = Arrays.asList(
                ProjectActivity.builder()
                        .project(smsProject)
                        .activity("Rahul created Login Module for Student Management System")
                        .userName("Rahul")
                        .userAvatar("RH")
                        .statusBadge("Task Created")
                        .build(),
                ProjectActivity.builder()
                        .project(smsProject)
                        .activity("Priya updated Database schema with foreign key indexes")
                        .userName("Priya")
                        .userAvatar("PR")
                        .statusBadge("Database Updated")
                        .build(),
                ProjectActivity.builder()
                        .project(smsProject)
                        .activity("Akash completed Testing suites for Auth controller")
                        .userName("Akash")
                        .userAvatar("AK")
                        .statusBadge("Testing Done")
                        .build(),
                ProjectActivity.builder()
                        .project(smsProject)
                        .activity("Manju generated Project Report PDF for Student Management System")
                        .userName("Manju")
                        .userAvatar("MJ")
                        .statusBadge("Report Generated")
                        .build()
        );

        projectActivityRepository.saveAll(activities);

        // --- 7. UNIFIED COMMENTS ---
        Task loginTask = tasks.get(0);
        List<UnifiedComment> comments = Arrays.asList(
                UnifiedComment.builder()
                        .targetType("TASK")
                        .targetId(loginTask.getId().toString())
                        .authorEmail("priya@flowforge.com")
                        .authorName("Priya")
                        .authorAvatar("PR")
                        .content("Please optimize this query to reduce join latency on user roles.")
                        .build(),
                UnifiedComment.builder()
                        .targetType("TASK")
                        .targetId(loginTask.getId().toString())
                        .authorEmail("rahul@flowforge.com")
                        .authorName("Rahul")
                        .authorAvatar("RH")
                        .content("Authentication completed and verified with JWT Bearer tokens.")
                        .build(),
                UnifiedComment.builder()
                        .targetType("TASK")
                        .targetId(loginTask.getId().toString())
                        .authorEmail("akash@flowforge.com")
                        .authorName("Akash")
                        .authorAvatar("AK")
                        .content("Waiting for QA approval on automated end-to-end tests.")
                        .build()
        );

        unifiedCommentRepository.saveAll(comments);

        // --- 8. FILE ATTACHMENTS ---
        List<FileAttachment> files = Arrays.asList(
                FileAttachment.builder()
                        .fileName("Requirements.pdf")
                        .fileSize("2.4 MB")
                        .sizeBytes(2516582L)
                        .fileType("application/pdf")
                        .targetType("PROJECT")
                        .targetId(smsProject.getId().toString())
                        .uploadedBy("manju@flowforge.com")
                        .fileData("data:application/pdf;base64,JVBERi0xLjQKJ...")
                        .build(),
                FileAttachment.builder()
                        .fileName("API_Documentation.pdf")
                        .fileSize("1.8 MB")
                        .sizeBytes(1887436L)
                        .fileType("application/pdf")
                        .targetType("PROJECT")
                        .targetId(smsProject.getId().toString())
                        .uploadedBy("priya@flowforge.com")
                        .fileData("data:application/pdf;base64,JVBERi0xLjQKJ...")
                        .build(),
                FileAttachment.builder()
                        .fileName("ER_Diagram.png")
                        .fileSize("850 KB")
                        .sizeBytes(870400L)
                        .fileType("image/png")
                        .targetType("PROJECT")
                        .targetId(smsProject.getId().toString())
                        .uploadedBy("priya@flowforge.com")
                        .fileData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")
                        .build(),
                FileAttachment.builder()
                        .fileName("Architecture.png")
                        .fileSize("1.2 MB")
                        .sizeBytes(1258291L)
                        .fileType("image/png")
                        .targetType("PROJECT")
                        .targetId(trackProject.getId().toString())
                        .uploadedBy("rahul@flowforge.com")
                        .fileData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")
                        .build(),
                FileAttachment.builder()
                        .fileName("Sprint_Report.xlsx")
                        .fileSize("420 KB")
                        .sizeBytes(430080L)
                        .fileType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        .targetType("PROJECT")
                        .targetId(resumeProject.getId().toString())
                        .uploadedBy("manju@flowforge.com")
                        .fileData("data:application/vnd.ms-excel;base64,UEsDBBQABgAIAAAAIQA...")
                        .build()
        );

        fileAttachmentRepository.saveAll(files);
    }
}
