# Course Management System API

ASP.NET Core Web API with JWT authentication, role-based authorization, entity relationships, and Hangfire background jobs.

## Technologies

- **ASP.NET Core 10.0** - Web API framework
- **Entity Framework Core 9.0** - ORM for database access
- **SQL Server LocalDB** - Database
- **JWT Bearer Authentication** - Token-based authentication
- **Hangfire** - Background job processing
- **Swashbuckle** - API documentation (Swagger)

## Entity Relationships

- **One-to-One**: Instructor ↔ InstructorProfile
- **One-to-Many**: Instructor → Courses, Course → Enrollments
- **Many-to-Many**: Student ↔ Course (via Enrollment)

## How to Run

1. Restore packages:
   ```bash
   dotnet restore
   ```

2. Update database:
   ```bash
   dotnet ef database update
   ```

3. Run application:
   ```bash
   dotnet run
   ```

4. Access Swagger UI at: `https://localhost:7029/swagger`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Instructors
- `GET /api/instructors` - List all instructors
- `GET /api/instructors/{id}` - Get instructor by ID
- `POST /api/instructors` - Create instructor (Admin only)
- `PUT /api/instructors/{id}` - Update instructor (Admin/Instructor)
- `DELETE /api/instructors/{id}` - Delete instructor (Admin only)

### Students
- `GET /api/students` - List all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/{id}` - Update student (Admin/Student)
- `DELETE /api/students/{id}` - Delete student (Admin only)

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create course (Admin/Instructor)
- `PUT /api/courses/{id}` - Update course (Admin/Instructor)
- `DELETE /api/courses/{id}` - Delete course (Admin only)

### Enrollments
- `GET /api/enrollments` - List all enrollments (Admin only)
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/{id}` - Update enrollment
- `DELETE /api/enrollments/{id}` - Delete enrollment

## Authentication

The API uses JWT Bearer authentication. To access protected endpoints:

1. Register a user with role (Admin, Instructor, or Student)
2. Login to receive a JWT token
3. Add token to Authorization header: `Bearer {token}`

### Example Login
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Example Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "admin@example.com",
  "role": "Admin",
  "expiresAt": "2025-04-02T15:30:00Z"
}
```

## Role-Based Authorization

- **Admin**: Full access to all endpoints
- **Instructor**: Can manage their courses and view enrollments
- **Student**: Can view courses and manage their enrollments

## Background Job (Hangfire)

A recurring job runs daily at midnight to clean up pending enrollments older than 7 days.

- **Job**: `cleanup-enrollments`
- **Schedule**: Daily (Cron: `0 0 * * *`)
- **Dashboard**: `/hangfire`

## HTTP-Only Cookies

HTTP-only cookies are the industry standard for secure authentication because:

1. **XSS Protection**: Cookies marked as HttpOnly cannot be accessed by JavaScript, preventing XSS attacks from stealing session tokens.

2. **Automatic Inclusion**: The browser automatically sends cookies with every request to the domain, simplifying authentication.

3. **Security Best Practice**: Modern web security standards recommend storing authentication tokens in HttpOnly cookies rather than localStorage or sessionStorage.

4. **CSRF Protection**: When combined with SameSite cookie attributes, HttpOnly cookies provide protection against both XSS and CSRF attacks.

## Project Structure

```
WebProject/
├── Controllers/        # API controllers
├── Database/           # DbContext
├── DTOs/              # Data Transfer Objects
├── Interfaces/        # Service interfaces
├── Models/            # Entity models
├── Services/          # Business logic
├── Migrations/        # EF Core migrations
├── Program.cs         # App startup
└── appsettings.json   # Configuration
```

## Screenshots

Add screenshots here showing:
- Swagger UI with API endpoints
- JWT authentication in action
- Successful API responses
- Hangfire Dashboard
- Database tables in SSMS

## Configuration

Update `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CourseManagementDB;Trusted_Connection=True"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32Characters!",
    "Issuer": "CourseManagementAPI",
    "Audience": "CourseManagementClient"
  }
}
```
