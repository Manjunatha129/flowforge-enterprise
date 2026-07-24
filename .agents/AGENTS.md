# TaskFlowe Project Guidelines & Agent Rules

## Permanent Rule 1: Beginner-Friendly Code Comments
Whenever code is created or modified in Java or React:
1. **Class Header**: Explain the purpose of the class, where it is used, and which components call it.
2. **Method Header**: Explain why the method exists, when it is executed, and its inputs/outputs.
3. **Inline Comments**: Provide clear comments for complex logic, JWT handling, JPA queries, React hooks (`useState`, `useEffect`), validation, state mutation, and conditional rendering.
4. **Annotation Explanations**: Explain Spring Boot annotations (`@RestController`, `@Service`, `@Repository`, `@Entity`, `@Transactional`, `@PreAuthorize`, etc.) in simple English.
5. **Preserve Comments**: Never remove existing comments; improve them.

## Permanent Rule 2: Synchronized Documentation Suite (`/docs`)
Never recreate or delete existing documentation files. After completing any module or feature, append and update all 7 documentation files:
1. `docs/README.md` — Project setup, architecture overview, features, and run commands.
2. `docs/SRS.md` — Functional & non-functional requirements, database design, and module scopes.
3. `docs/ARCHITECTURE.md` — Package design, MVC execution flow, request pipelines, security flows, and architectural decisions.
4. `docs/API_DOCUMENTATION.md` — Detailed REST API specs, request/response bodies, status codes, and query params.
5. `docs/DATABASE.md` — Mermaid ER diagrams, table schemas, foreign keys, indexes, and sample data.
6. `docs/DEVELOPER_JOURNAL.md` — What was built, why, challenges faced, solutions, interview questions, and key learnings.
7. `docs/LEARNING_NOTES.md` — In-depth technical explanations of Spring Boot, React, JWT, JPA, and web design concepts.
