# TrackIT
## Issue Tracking and Engineering Workflow Platform

TrackIT is a full-stack issue tracking platform designed to help software teams manage bugs, technical issues, assignments, discussions, and resolution workflows from a centralized system.

The platform provides a structured environment where reporters can submit issues, developers can investigate and resolve them, and administrators can manage users, permissions, and system activity. Instead of treating bug reports as isolated records, TrackIT manages the complete issue lifecycle, from initial reporting and prioritization to assignment, collaboration, status tracking, and closure.

### Platform capabilities

TrackIT provides a complete workflow for managing software issues across different user roles.

Users can create detailed issue reports with severity and priority levels, attach supporting files such as screenshots or error logs, and follow the progress of reported problems. Issues can be assigned to developers and moved through defined lifecycle states including Open, In Progress, and Closed.

Developers and reporters can communicate directly within an issue through threaded discussions, keeping technical conversations connected to the problem being resolved.

The system also provides advanced search and filtering, allowing users to locate issues by keyword, status, severity, or priority. Pagination is supported for larger issue repositories.

For operational visibility, TrackIT includes dashboards that provide bug statistics, completion information, and access to critical issues. An event-driven notification mechanism informs relevant users when important changes occur within the system.

Administrators have a dedicated management layer for controlling users, assigning roles, removing accounts, and reviewing system-level statistics.

### Role-based workflow

TrackIT separates responsibilities through three user roles:

**Reporter**

Reporters can submit software issues, provide supporting information and attachments, participate in issue discussions, and follow the progress of reported problems.

**Developer**

Developers can work on assigned issues, participate in technical discussions, update issue status, and contribute to the resolution workflow.

**Administrator**

Administrators manage users, roles, permissions, system statistics, and administrative operations.

This role structure allows the platform to enforce clear access boundaries while supporting collaboration between the people reporting problems and the developers responsible for resolving them.

### Issue management

The issue management module handles the main lifecycle of a software problem.

Each issue can contain information such as its priority, severity, status, assigned developer, comments, and supporting files. TrackIT supports creating, retrieving, updating, assigning, searching, prioritizing, and deleting issues through REST API endpoints.

Issue status transitions are managed through the service layer rather than allowing unrestricted database changes, keeping workflow logic separate from persistence.

### Search and filtering

TrackIT includes a dedicated search service for working with larger collections of issues.

Users can search by keyword and filter results according to status, priority, and severity. Custom repository queries and pagination support allow the platform to retrieve relevant issue records without requiring users to manually browse the entire issue database.

Input is sanitized before being used in search operations.

### Collaboration

Technical discussions are stored directly alongside the issue they relate to.

Users can create threaded comments, view issue discussions, and edit or remove comments through dedicated API endpoints. This keeps investigation details, developer feedback, and issue history within the same workflow.

### Notifications and critical issue monitoring

TrackIT uses an event-driven notification mechanism based on the Observer pattern.

The notification service can generate alerts for relevant users when important events occur. Notifications can be retrieved through the API, tracked as read or unread, and removed when they are no longer needed.

Critical issues can also be surfaced through dedicated dashboard functionality, helping teams identify problems that require attention.

### Analytics dashboard

The dashboard provides an operational view of the issue repository.

It exposes statistics such as bug counts, completion information, and critical issue data through dedicated REST endpoints. This gives teams a centralized view of current system activity instead of requiring them to review individual issues separately.

### Security

Security is handled through Spring Security and JWT-based authentication.

The platform includes:

- JWT token generation, validation, and expiration
- Role-based access control for Administrators, Developers, and Reporters
- BCrypt password hashing
- Endpoint authorization
- CORS configuration for frontend communication
- Input sanitization
- File type and file size validation
- Secure handling of uploaded files

API responses use dedicated Data Transfer Objects so internal entity structures do not need to be exposed directly to clients.

### File and attachment handling

Users can attach supporting material such as screenshots and error logs to issue reports.

The file storage layer validates uploaded files, generates unique filenames, and stores approved files through a dedicated utility instead of placing file-management responsibilities inside controllers or business services.

### Backend architecture

TrackIT follows a layered Spring Boot architecture that separates application responsibilities across several components.

**Controller layer**

Handles HTTP requests and exposes REST endpoints for authentication, issues, comments, dashboards, notifications, and administration.

**Service layer**

Contains application and workflow logic for authentication, issue management, searching, commenting, and notifications.

**Repository layer**

Uses Spring Data JPA to handle persistence and database queries.

**DTO layer**

Controls data exchanged between the API and its clients.

**Domain model**

Represents users, issues, comments, notifications, roles, priorities, severities, and issue states.

**Security layer**

Handles JWT authentication and Spring Security integration.

**Utility layer**

Provides supporting functionality such as secure file storage and validation.

This separation keeps HTTP handling, business rules, persistence, security, and data representation independent from one another.

### Engineering patterns

Several established software design patterns are used throughout the platform.

The Repository pattern separates persistence logic from application logic, while the Service Layer pattern keeps business operations outside controllers.

DTOs define the information exchanged through the REST API without exposing complete persistence entities.

The notification mechanism applies the Observer pattern for event-driven alerts, while Lombok's Builder support is used for structured entity creation.

The project configuration also includes a DatabaseConnection component following a Singleton approach.

### REST API

TrackIT exposes REST endpoints across five primary areas.

#### Authentication

`POST /api/auth/register`  
Register a user.

`POST /api/auth/login`  
Authenticate a user and return a JWT token.

#### Issue management

`POST /api/issues`  
Create an issue.

`GET /api/issues`  
Retrieve issues.

`GET /api/issues/{id}`  
Retrieve a specific issue.

`GET /api/issues/status/{status}`  
Filter issues according to status.

`PUT /api/issues/{id}`  
Update an issue.

`PUT /api/issues/{id}/status/{newStatus}`  
Change issue status.

`PUT /api/issues/{id}/assign/{developerId}`  
Assign an issue to a developer.

`PUT /api/issues/{id}/priority/{priority}`  
Change issue priority.

`DELETE /api/issues/{id}`  
Delete an issue.

`GET /api/issues/search?keyword=...`  
Search the issue repository.

#### Comments

`POST /api/comments`  
Add a comment.

`GET /api/comments/issue/{issueId}`  
Retrieve comments for an issue.

`PUT /api/comments/{id}`  
Edit a comment.

`DELETE /api/comments/{id}`  
Delete a comment.

#### Dashboard and notifications

`GET /api/dashboard/stats`  
Retrieve issue statistics.

`GET /api/dashboard/critical`  
Retrieve critical issues.

`GET /api/notifications`  
Retrieve notifications.

`GET /api/notifications/unread`  
Retrieve unread notifications.

`PUT /api/notifications/{id}/read`  
Mark a notification as read.

`DELETE /api/notifications/{id}`  
Delete a notification.

#### Administration

`GET /api/admin/users`  
Retrieve system users.

`DELETE /api/admin/users/{id}`  
Remove a user.

`PUT /api/admin/users/{id}/role/{role}`  
Change a user's role.

`GET /api/admin/stats`  
Retrieve system statistics.

### Technology stack

The backend is built with Java and Spring Boot and uses Spring Data JPA for persistence, Spring Security for authorization, and JWT for token-based authentication.

MySQL provides relational data storage.

JUnit 5 and Mockito are used for automated testing across service and controller functionality.

The REST API is configured for integration with a React-based frontend.

### Testing

TrackIT includes automated tests for core application behavior.

Service-level tests cover issue creation, issue retrieval, status updates, deletion, authentication, registration, login behavior, and password validation.

Controller integration tests verify HTTP responses, status codes, and request/response processing.

The project can also generate test coverage reports through JaCoCo.

### Development environment

The backend requires:

- JDK 17
- Maven 3.8 or later
- MySQL 8.0 or later

The application runs through Spring Boot and exposes its REST API on:

`http://localhost:8080`

A React client can connect to the API through the configured CORS settings.

### Project structure

```text
trackit/
├── src/
│   ├── main/
│   │   ├── java/com/trackit/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── security/
│   │   │   ├── utils/
│   │   │   └── TrackitApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/trackit/
├── pom.xml
└── README.md
```

### Running TrackIT

Create the MySQL database:

```sql
CREATE DATABASE trackit_db;
USE trackit_db;
```

Configure the application credentials in:

```text
src/main/resources/application.properties
```

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
jwt.secret=your_super_secret_jwt_key_256_bits_or_longer
```

Build the project:

```bash
cd "d:\6th Sem\SCD T\ESP\trackit"
mvn clean package -DskipTests
```

Run the application:

```bash
mvn spring-boot:run
```

Alternatively:

```bash
java -jar target/trackit-0.0.1-SNAPSHOT.jar
```

Run the automated test suite with:

```bash
mvn test
```

Individual tests can be executed with:

```bash
mvn test -Dtest=IssueServiceTest
```

Coverage reports can be generated using:

```bash
mvn test jacoco:report
```

## Project summary

TrackIT combines issue management, access control, team communication, search, notifications, analytics, file handling, and administrative controls within a single Spring Boot application.

Its architecture separates API handling, business logic, persistence, security, and data transfer concerns, giving the system a structure that can be maintained and extended as additional workflow requirements are introduced.
