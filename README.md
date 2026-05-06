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

A full-stack course management application with a React frontend and an ASP.NET Core Web API backend. The app supports browsing and managing courses, students, instructors, and enrollments with JWT authentication and role-based access control.

## Application Overview

Features:
- Role-based authentication (Admin, Instructor, Student)
- Course CRUD and instructor assignment
- Student management and enrollments (create/view/update/delete)
- Responsive React UI built with Vite

## Setup (Frontend & Backend)

Prerequisites:
- Node.js v16+
- .NET 10 SDK
- SQL Server Express / LocalDB

Backend (run from `WebProject`):
```powershell
cd WebProject
dotnet restore
dotnet ef database update
dotnet run
```

Backend dev URLs (from `launchSettings.json`): `http://localhost:5265` and `https://localhost:7029`.

Frontend (run from `CourseManagementUI`):
```bash
cd CourseManagementUI
npm install
npm run dev
```

Frontend dev URL: `http://localhost:5173` (Vite server). The frontend proxies `/api` to `http://localhost:5265` during development.

## Project Structure

```
Web Project/
├── CourseManagementUI/   # React frontend (Vite)
├── WebProject/           # ASP.NET Core backend (API)
└── README.md             # This consolidated project README
```

## API Routes (used by the frontend)

Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

Courses
- GET    /api/courses
- GET    /api/courses/{id}
- GET    /api/courses/{id}/enrollments
- GET    /api/courses/instructor/{instructorId}
- POST   /api/courses
- PUT    /api/courses/{id}
- DELETE /api/courses/{id}

Students
- GET    /api/students
- GET    /api/students/{id}
- GET    /api/students/{id}/enrollments
- POST   /api/students
- PUT    /api/students/{id}
- DELETE /api/students/{id}

Instructors
- GET    /api/instructors
- GET    /api/instructors/{id}
- POST   /api/instructors
- PUT    /api/instructors/{id}
- DELETE /api/instructors/{id}

Enrollments
- GET    /api/enrollments
- GET    /api/enrollments/{id}
- GET    /api/enrollments/student/{studentId}
- GET    /api/enrollments/course/{courseId}
- POST   /api/enrollments
- PUT    /api/enrollments/{id}
- DELETE /api/enrollments/{id}

## Frontend Routes

```
/                     Home
/login                Login
/register             Register
/courses              Courses list
/courses/new          Create course
/courses/:id          Course details
/courses/:id/edit     Edit course
/students             Students list
/students/new         Create student
/students/:id         Student details
/students/:id/edit    Edit student
/instructors          Instructors list
/instructors/new      Create instructor
/instructors/:id      Instructor details
/instructors/:id/edit Edit instructor
/enrollments          Enrollments list
/enrollments/new      Create enrollment
/enrollments/:id      Enrollment details
/enrollments/:id/edit Edit enrollment
```

## Screenshots

- Home page
![alt text](<Screenshot 2026-05-06 115534.png>)
- Courses page
![alt text](<Screenshot 2026-05-06 115551.png>)

- Students page
![alt text](<Screenshot 2026-05-06 115600.png>)
- Instructors page
![alt text](<Screenshot 2026-05-06 115607.png>)

- Enrollments page
![alt text](<Screenshot 2026-05-06 115615.png>)

- Login page
![alt text](<Screenshot 2026-05-06 115628.png>)

- Register page
![alt text](<Screenshot 2026-05-06 115635.png>)