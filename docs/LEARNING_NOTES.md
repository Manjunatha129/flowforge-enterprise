# FlowForge - Learning Notes & Technical Educational Guide

Welcome to the **FlowForge Learning Guide**! This document explains core Spring Boot and React concepts like a mentor guiding a beginner.

---

## 🍃 Spring Boot Core Concepts

### 1. The `@RestController` Annotation
- **What it is**: Combines `@Controller` and `@ResponseBody`.
- **Why it exists**: Tells Spring Boot that this class handles incoming HTTP REST API requests and returns Java objects serialized directly into JSON.
- **Real-World Analogy**: Like a bank teller who accepts your deposit request slip and hands you back a structured receipt.
- **Common Mistake**: Forgetting `@RestController` and using `@Controller` instead without `@ResponseBody` (which causes Spring to look for HTML view templates like Thymeleaf/JSP).

---

### 2. The `@Service` & `@Transactional` Annotations
- **What it is**: Marks a class as containing business rules. `@Transactional` ensures all database operations inside a method succeed together or rollback if an exception occurs.
- **Real-World Analogy**: A bank transfer operation where money is deducted from Account A and added to Account B. If the connection fails halfway through, `@Transactional` rolls back both actions so money is not lost.

---

### 3. Spring Security & Stateless JWT Authentication
- **Why Stateless Auth?**: Traditional web apps store session IDs in server memory. If you scale to 10 servers, users get logged out when routed to a different server. Stateless JWTs store user identity in a digitally signed token on the client, eliminating server session storage.
- **BCrypt Password Hashing**: Hashing is one-way. BCrypt adds a random salt and runs 10+ rounds of computation, making it impossible to reverse-engineer passwords even if hackers dump the database.

---

### 3. Spring Data JPA Bulk Queries (`@Modifying` & `@Query`)
- **What it is**: Spring Data JPA methods like `@Modifying @Query("UPDATE Notification n SET n.readStatus = true WHERE n.receiver = :receiver")`.
- **Why it exists**: Enables executing single SQL `UPDATE` / `DELETE` statements directly in the database without fetching 100 entities into Java memory individually.

---

### 4. Spring Security Method Security (`@EnableMethodSecurity` & `@PreAuthorize`)
- **What it is**: Spring Security annotation `@PreAuthorize("hasRole('ADMIN')")`.
- **Why it exists**: Secures REST API controller methods at the code execution level, verifying user authority before executing business logic.

### 7. WebSocket STOMP Messaging Architecture & JWT Security Interceptors
- **WebSocket Protocol**: Upgrades an HTTP connection to a persistent bi-directional TCP channel.
- **STOMP (Simple Text Oriented Messaging Protocol)**: High-level messaging subprotocol running over WebSockets that defines frames (`CONNECT`, `SUBSCRIBE`, `SEND`, `MESSAGE`) and destinations (`/topic`, `/queue`).
- **ChannelInterceptor JWT Auth**: Intercepts STOMP `CONNECT` frames before session establishment to extract `Authorization: Bearer <token>` and set `StompHeaderAccessor.setUser(authentication)` for security.
### 9. OpenAPI 3.0 & Swagger UI Integration (`springdoc-openapi-starter-webmvc-ui`)
- **OpenAPI 3.0 Standard**: A machine-readable REST API specification standard formatted in JSON/YAML.
- **Swagger UI**: Renders an interactive web interface (`/swagger-ui.html`) enabling developers to inspect API schemas, try out HTTP calls, and authenticate with JWT Bearer tokens directly from the browser.

### 10. Spring Boot Actuator Monitoring (`spring-boot-starter-actuator`)
- **Health Check (`/actuator/health`)**: Inspects datastore connections, disk space, and application status returning `{"status": "UP"}`.
- **Metrics (`/actuator/metrics`)**: Exposes JVM memory usage, garbage collection pause times, active thread counts, and HTTP request throughput counters.

### 12. Multi-Stage Docker Build Optimization
- **Build Stage vs Runtime Stage**: Building source code in a compilation stage with full JDK/Node tooling, then copying only the compiled artifacts (`app.jar` or `dist/`) into a minimal runtime image (Alpine JRE/Nginx). Reduces final image sizes from >1GB down to ~150MB.

### 13. Production Nginx Reverse Proxy Architecture
- **SPA Routing (`try_files $uri /index.html`)**: Prevents 404 errors on browser page reloads when using client-side React Router.
- **API Reverse Proxying (`location /api/`)**: Eliminates browser CORS issues by serving both frontend UI and backend REST API on the same domain and port.
- **WebSocket Upgrade Headers**: Forwards `Upgrade: $http_upgrade` and `Connection: "Upgrade"` headers required for STOMP WebSocket handshakes.

### 14. Lombok `@Builder` & Initialized Fields (`@Builder.Default`)
- **What it is**: When using Lombok's `@Builder` on a class with inline field initializers (e.g. `private ProjectStatus status = ProjectStatus.ACTIVE`), Lombok ignores field initializations unless annotated with `@Builder.Default`.
- **Why it exists**: `@Builder.Default` signals Lombok's generated builder pattern implementation to retain the default field values if they are omitted during instance construction.

---

## ⚛️ React & Modern Frontend Concepts

### 1. `useState` & `useEffect`
- **`useState`**: Holds reactive data. When state changes, React automatically re-renders the component.
- **`useEffect`**: Performs side-effects (e.g. fetching API data on component mount).
- **Real-World Analogy**: `useState` is like a digital clock display updating every second; `useEffect` is like setting an alarm that rings when the clock mounts.

---

### 2. Context API & Custom Hooks (`useAuth`, `useTheme`, `useToast`)
- **Prop Drilling Problem**: Passing `user` data down through 5 levels of components (`App -> MainLayout -> Header -> UserProfile -> UserAvatar`).
- **Context Solution**: `AuthContext` makes `user` and `login` accessible to ANY component in the tree instantly via `const { user } = useAuth()`.

---

### 3. Admin Route Guards & RBAC Protection
- **`AdminRoute` Component**: A React Router guard component that inspects `user?.role === 'ROLE_ADMIN'`. Non-admin accounts receive a 403 Forbidden Access Denied card.

---

### 4. HTML5 Blob Object URLs (`window.URL.createObjectURL`)
- **What it is**: Converting Axios binary array buffer responses (`responseType: 'blob'`) into temporary browser memory URLs.
- **Why it exists**: Enables client-side JavaScript to automatically trigger file downloads for PDF, Excel, and CSV streams without navigating away from the page.

---

## 🔒 Spring Security Concepts

### 1. `SecurityFilterChain` & `requestMatchers`
- **What it is**: Spring Security's request processing pipeline where incoming HTTP requests pass through security filters (CORS, CSRF, JWT validation).
- **`permitAll()`**: Instructs Spring Security to bypass authentication checks for public endpoints (such as `/api/auth/**` and `/api/v1/auth/**`).
- **`anyRequest().authenticated()`**: Enforces authentication on all unspecified routes, requiring a valid JWT Bearer token.





