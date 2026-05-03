# TrackIT - Bug Tracking System - Complete Implementation Guide

##  IMPLEMENTATION STATUS - 100% COMPLETE

### What Has Been Implemented:

#### 1. **Entity Models (with JPA Annotations)**
- `User.java` - With roles (ADMIN, DEVELOPER, REPORTER)
- `Issue.java` - With Priority, Severity, Status enums
- `Comment.java` - Threaded commenting linked to issues
- `Notification.java` - Alert system with read/unread flags
- `Role.java` - Enum with ADMIN, DEVELOPER, REPORTER
- `Severity.java` - Enum with LOW, MEDIUM, HIGH, CRITICAL
- `Priority.java` - Enum with LOW, MEDIUM, HIGH, URGENT
- `IssueStatus.java` - Enum with OPEN, IN_PROGRESS, CLOSED

#### 2. **Data Access Layer (Repositories)**
- `IssueRepository.java` - Advanced search with custom JPQL queries
  - Full-text search by keyword
  - Filter by status, priority, severity
  - Critical issues dashboard query
  - Pagination support
- `CommentRepository.java` - Threaded comments management
- `NotificationRepository.java` - Notification queries
- `UserRepository.java` - User management (existing)

#### 3. **Business Logic Layer (Services)**
- `AuthService.java` - Authentication & registration (FIXED)
- `IssueService.java` - Issue CRUD with state transitions
  - Create issues (Bug Reporting - Feature 2)
  - Assign to developers (Assignments - Feature 3)
  - Update status transitions (Status Updates - Feature 4)
  - Get critical issues for dashboard (Feature 8)
- `CommentService.java` - Threaded commenting (Feature 5)
- `SearchService.java` - Advanced search & filtering (Feature 7)
  - Sanitized input to prevent SQL injection
  - Complex query building
  - Pagination support
- `NotificationService.java` - Observer pattern implementation (Feature 8)
  - Event-driven alerts
  - Real-time notifications
  - Automatic broadcast to relevant users

#### 4. **Rest API Controllers**
- `AuthController.java` - Login/Register endpoints
- `IssueController.java` - Issue management endpoints
  - Create, Read, Update, Delete issues
  - Assign developers
  - Update status and priority
  - Search capabilities
- `CommentController.java` - Comment management (Feature 5)
  - Add comments to issues
  - View threaded comments
  - Edit/delete comments
- `DashboardController.java` - Analytics & statistics (Feature 8)
  - Real-time bug counts
  - Completion rates
  - Critical issues alerts
- `AdminController.java` - Admin management panel (Feature 10)
  - User management
  - Role assignment
  - System statistics
- `NotificationController.java` - Notification endpoints
  - Get user notifications
  - Mark as read
  - Fetch unread notifications

#### 5. **Data Transfer Objects (DTOs)**
- `IssueCreateRequest` - For creating issues
- `IssueResponse` - For returning issue data
- `IssueUpdateRequest` - For updating issues
- `CommentResponse` - For returning comments
- `CommentCreateRequest` - For creating comments
- `NotificationResponse` - For returning notifications
-   `UserResponse` - For returning user data (secured)
- `DashboardStatsResponse` - For analytics
- `SearchRequest` - For search filters
- `RegisterRequest` - For user registration
- `LoginRequest` - For user login

#### 6. **Utilities**
- `FileStorageUtil.java` - File upload handling (Feature 2)
  - Upload error logs and screenshots
  - File validation (size, type)
  - Unique filename generation
  - Secure file storage

#### 7. **Security & JWT**
- `JwtUtil.java` - UPDATED with modern JJWT API
  - Token generation
  - Token validation
  - Token expiration
-  `SecurityConfig.java` - Spring Security configuration
  - CORS setup for React frontend
  - JWT filter integration
  - Role-based access control

#### 8. **Testing**
-  `IssueServiceTest.java` - Unit tests with Mockito
  - Create issue tests
  - Retrieve issue tests
  - Status update tests
  - Delete issue tests
- `IssueControllerTest.java` - Integration tests
  - HTTP response validation
  - Status code verification
  - Request/response parsing
-`AuthServiceTest.java` - Authentication tests
  - Registration tests
  - Login success/failure tests
  - Password validation tests

#### 9. **Configuration**
-  `application.properties` - UPDATED with:
  - MySQL connection settings
  - JPA/Hibernate configuration
  - JWT secret & expiration
  - File upload configuration
  - CORS settings
  - Logging configuration
-  `pom.xml` - FIXED with all dependencies:
  - Spring Boot 4.0.5
  - Spring Data JPA
  - Spring Security
  - MySQL Connector
  - JWT (JJWT 0.12.3)
  - Lombok
  - JUnit 5 & Mockito

---

## HOW TO RUN THE SYSTEM

### Prerequisites:
1. **JDK 17** installed
2. **Maven 3.8+** installed
3. **MySQL 8.0+** server running
4. **React Frontend** running on `localhost:3000` (optional for initial backend testing)

### Step 1: Create MySQL Database

```sql
CREATE DATABASE trackit_db;
USE trackit_db;
```

### Step 2: Update Database Credentials

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
jwt.secret=your_super_secret_jwt_key_256_bits_or_longer
```

### Step 3: Build the Project

```bash
cd "d:\6th Sem\SCD T\ESP\trackit"
mvn clean package -DskipTests
```

### Step 4: Run the Application

```bash
mvn spring-boot:run
```

Or using JAR:
```bash
java -jar target/trackit-0.0.1-SNAPSHOT.jar
```

### Step 5: Access the API

- **API Base URL**: `http://localhost:8080`
- **API Documentation**: See endpoint list below

---

##  API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Issues (Bug Tracking)
- `POST /api/issues` - Create new issue
- `GET /api/issues` - Get all issues
- `GET /api/issues/{id}` - Get specific issue
- `GET /api/issues/status/{status}` - Filter by status
- `PUT /api/issues/{id}` - Update issue
- `PUT /api/issues/{id}/status/{newStatus}` - Update status
- `PUT /api/issues/{id}/assign/{developerId}` - Assign developer
- `PUT /api/issues/{id}/priority/{priority}` - Update priority
- `DELETE /api/issues/{id}` - Delete issue
- `GET /api/issues/search?keyword=...` - Search issues

### Comments (Threaded Discussion)
- `POST /api/comments` - Add comment to issue
- `GET /api/comments/issue/{issueId}` - Get issue comments
- `PUT /api/comments/{id}` - Edit comment
- `DELETE /api/comments/{id}` - Delete comment

### Dashboard (Analytics)
- `GET /api/dashboard/stats` - Get bug statistics
- `GET /api/dashboard/critical` - Get critical issues

### Notifications (Alerts)
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

### Admin
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/{id}` - Delete user
- `PUT /api/admin/users/{id}/role/{role}` - Change user role
- `GET /api/admin/stats` - System statistics

---

## Security Features Implemented

1. **JWT Authentication** - Token-based authentication
2. **Role-Based Access Control (RBAC)** - Three roles: ADMIN, DEVELOPER, REPORTER
3. **CORS Configuration** - React frontend communication
4. **Password Encoding** - BCrypt password hashing
5. **Input Sanitization** - SQL injection prevention
6. **Endpoint Authorization** - @PreAuthorize annotations

---

## Design Patterns Used

1. **Observer Pattern** - Notification service for event-driven alerts
2. **Singleton Pattern** - DatabaseConnection (mentioned in config)
3. **Repository Pattern** - Data access abstraction
4. **Service Layer Pattern** - Business logic separation
5. **DTO Pattern** - Data transfer objects for security
6. **Builder Pattern** - Entity creation (Lombok @Builder)

---

## Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=IssueServiceTest

# Run with coverage
mvn test jacoco:report
```

---

## Project Structure

```
trackit/
├── src/
│   ├── main/
│   │   ├── java/com/trackit/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── DatabaseConnection.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── IssueController.java
│   │   │   │   ├── CommentController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   └── NotificationController.java
│   │   │   ├── dto/
│   │   │   │   ├── IssueCreateRequest.java
│   │   │   │   ├── IssueResponse.java
│   │   │   │   ├── CommentResponse.java
│   │   │   │   ├── NotificationResponse.java
│   │   │   │   └── ...
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Issue.java
│   │   │   │   ├── Comment.java
│   │   │   │   ├── Notification.java
│   │   │   │   ├── Role.java
│   │   │   │   ├── Severity.java
│   │   │   │   ├── Priority.java
│   │   │   │   └── IssueStatus.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── IssueRepository.java
│   │   │   │   ├── CommentRepository.java
│   │   │   │   └── NotificationRepository.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── IssueService.java
│   │   │   │   ├── CommentService.java
│   │   │   │   ├── SearchService.java
│   │   │   │   └── NotificationService.java
│   │   │   ├── security/
│   │   │   │   └── JwtUtil.java
│   │   │   ├── utils/
│   │   │   │   └── FileStorageUtil.java
│   │   │   └── TrackitApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/trackit/
│           ├── service/
│           │   ├── IssueServiceTest.java
│           │   └── AuthServiceTest.java
│           └── controller/
│               └── IssueControllerTest.java
├── pom.xml
└── README.md
```

---

## Features Implemented

| Feature | Status | Implementation |
|---------|--------|-----------------|
| 1. Secure Authentication & RBAC |  | JWT + Spring Security |
| 2. Bug Reporting |  | Issue model + FileStorageUtil |
| 3. Issue Assignments |  | assignDeveloper() method |
| 4. Status Updates |  | State transition validation |
| 5. Threaded Commenting |  | Comment model + CommentService |
| 6. Attachment Support |  | FileStorageUtil + Issue links |
| 7. Advanced Search & Filtering |  | SearchService + Custom queries |
| 8. Real-Time Analytics |  | DashboardController + Observer pattern |
| 9. Critical Issue Alerts |  | NotificationService events |
| 10. Admin Management Panel |  | AdminController + RBAC |

---

## Troubleshooting

### Issue: Cannot connect to MySQL
**Solution**: Ensure MySQL is running and credentials in `application.properties` are correct.

### Issue: JWT Token validation fails
**Solution**: Update `jwt.secret` in `application.properties` with a 256-bit key.

### Issue: CORS errors from React frontend
**Solution**: Ensure `cors.allowed-origins` in `application.properties` matches your frontend URL.

### Issue: File upload fails
**Solution**: Create `uploads/` directory in project root or ensure write permissions.

---
##  Default Test Users

Use these for testing (add manually to database or update register endpoint):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@trackit.com | admin123 |
| Developer | dev@trackit.com | dev123 |
| Reporter | reporter@trackit.com | reporter123 |

---

##  NEXT STEPS

1. Clean build: `mvn clean install`
2. Run tests: `mvn test`
3. Start server: `mvn spring-boot:run`
4. Test API with Postman/Insomnia
5.  Connect React frontend (Point API URL to `http://localhost:8080`)

---

**System Development Complete! **
All 10 features fully implemented with proper architecture and testing.
