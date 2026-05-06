using Microsoft.EntityFrameworkCore;
using WebProject.Database;
using WebProject.DTOs;
using WebProject.Interfaces;
using WebProject.Models;

namespace WebProject.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly ApplicationDbContext _context;
    private readonly ICourseService _courseService;

    public EnrollmentService(ApplicationDbContext context, ICourseService courseService)
    {
        _context = context;
        _courseService = courseService;
    }

    public async Task<EnrollmentDto?> GetByIdAsync(int id)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => new EnrollmentDto
            {
                Id = e.Id,
                EnrollmentDate = e.EnrollmentDate,
                Grade = e.Grade,
                Student = new StudentListDto
                {
                    Id = e.Student.Id,
                    StudentId = e.Student.StudentId,
                    FullName = $"{e.Student.FirstName} {e.Student.LastName}",
                    Email = e.Student.Email
                },
                Course = new CourseListDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    CourseCode = e.Course.CourseCode,
                    InstructorName = e.Course.Instructor != null ? $"{e.Course.Instructor.FirstName} {e.Course.Instructor.LastName}" : null
                }
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<EnrollmentDto>> GetAllAsync()
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Select(e => new EnrollmentDto
            {
                Id = e.Id,
                EnrollmentDate = e.EnrollmentDate,
                Grade = e.Grade,
                Student = new StudentListDto
                {
                    Id = e.Student.Id,
                    StudentId = e.Student.StudentId,
                    FullName = $"{e.Student.FirstName} {e.Student.LastName}",
                    Email = e.Student.Email
                },
                Course = new CourseListDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    CourseCode = e.Course.CourseCode,
                    InstructorName = e.Course.Instructor != null ? $"{e.Course.Instructor.FirstName} {e.Course.Instructor.LastName}" : null
                }
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentEnrollmentDto>> GetByStudentAsync(int studentId)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.StudentId == studentId)
            .Select(e => new StudentEnrollmentDto
            {
                Id = e.Id,
                EnrollmentDate = e.EnrollmentDate,
                Grade = e.Grade,
                Course = new CourseListDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    CourseCode = e.Course.CourseCode,
                    InstructorName = e.Course.Instructor != null ? $"{e.Course.Instructor.FirstName} {e.Course.Instructor.LastName}" : null
                }
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<EnrollmentDto>> GetAllByStudentAsync(int studentId)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.StudentId == studentId)
            .Select(e => new EnrollmentDto
            {
                Id = e.Id,
                EnrollmentDate = e.EnrollmentDate,
                Grade = e.Grade,
                Student = new StudentListDto
                {
                    Id = e.Student.Id,
                    StudentId = e.Student.StudentId,
                    FullName = $"{e.Student.FirstName} {e.Student.LastName}",
                    Email = e.Student.Email
                },
                Course = new CourseListDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    CourseCode = e.Course.CourseCode,
                    InstructorName = e.Course.Instructor != null ? $"{e.Course.Instructor.FirstName} {e.Course.Instructor.LastName}" : null
                }
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CourseEnrollmentDto>> GetByCourseAsync(int courseId)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.CourseId == courseId)
            .Select(e => new CourseEnrollmentDto
            {
                Id = e.Id,
                EnrollmentDate = e.EnrollmentDate,
                Grade = e.Grade,
                Student = new StudentListDto
                {
                    Id = e.Student.Id,
                    StudentId = e.Student.StudentId,
                    FullName = $"{e.Student.FirstName} {e.Student.LastName}",
                    Email = e.Student.Email
                }
            })
            .ToListAsync();
    }

    public async Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto dto)
    {
        var courseExists = await _courseService.ExistsAsync(dto.CourseId);
        if (!courseExists)
            throw new InvalidOperationException("Course does not exist");

        var studentExists = await _context.Students.AnyAsync(s => s.Id == dto.StudentId);
        if (!studentExists)
            throw new InvalidOperationException("Student does not exist");

        var isAlreadyEnrolled = await IsStudentEnrolledAsync(dto.StudentId, dto.CourseId);
        if (isAlreadyEnrolled)
            throw new InvalidOperationException("Student is already enrolled in this course");

        var enrollment = new Enrollment
        {
            StudentId = dto.StudentId,
            CourseId = dto.CourseId,
            EnrollmentDate = DateTime.UtcNow,
            Grade = dto.Grade
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(enrollment.Id) ?? throw new InvalidOperationException("Failed to retrieve created enrollment");
    }

    public async Task<EnrollmentDto?> UpdateAsync(int id, UpdateEnrollmentDto dto)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);
        if (enrollment == null)
            return null;

        if (dto.Grade.HasValue)
            enrollment.Grade = dto.Grade.Value;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);
        if (enrollment == null)
            return false;

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .AnyAsync(e => e.Id == id);
    }

    public async Task<bool> IsStudentEnrolledAsync(int studentId, int courseId)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
    }
}
