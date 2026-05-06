using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using WebProject.Database;
using WebProject.DTOs;
using WebProject.Interfaces;
using WebProject.Models;

namespace WebProject.Services;

public class CourseService : ICourseService
{
    private readonly ApplicationDbContext _context;

    public CourseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CourseDto?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                CourseCode = c.CourseCode,
                InstructorId = c.InstructorId,
                Instructor = new InstructorListDto
                {
                    Id = c.Instructor.Id,
                    FullName = $"{c.Instructor.FirstName} {c.Instructor.LastName}",
                    Email = c.Instructor.Email,
                    Department = c.Instructor.Department
                }
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CourseWithEnrollmentsDto?> GetByIdWithEnrollmentsAsync(int id)
    {
        return await _context.Courses
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CourseWithEnrollmentsDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                CourseCode = c.CourseCode,
                InstructorId = c.InstructorId,
                Instructor = new InstructorListDto
                {
                    Id = c.Instructor.Id,
                    FullName = $"{c.Instructor.FirstName} {c.Instructor.LastName}",
                    Email = c.Instructor.Email,
                    Department = c.Instructor.Department
                },
                Enrollments = c.Enrollments
                    .Select(e => new EnrollmentListDto
                    {
                        Id = e.Id,
                        EnrollmentDate = e.EnrollmentDate,
                        Grade = e.Grade
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<CourseListDto>> GetAllAsync()
    {
        return await _context.Courses
            .AsNoTracking()
            .Select(c => new CourseListDto
            {
                Id = c.Id,
                Title = c.Title,
                CourseCode = c.CourseCode,
                InstructorName = $"{c.Instructor.FirstName} {c.Instructor.LastName}"
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CourseListDto>> GetByInstructorAsync(int instructorId)
    {
        return await _context.Courses
            .AsNoTracking()
            .Where(c => c.InstructorId == instructorId)
            .Select(c => new CourseListDto
            {
                Id = c.Id,
                Title = c.Title,
                CourseCode = c.CourseCode,
                InstructorName = $"{c.Instructor.FirstName} {c.Instructor.LastName}"
            })
            .ToListAsync();
    }

    public async Task<CourseDto> CreateAsync(CreateCourseDto dto)
    {
        Course course;
        
        try
        {
            // Check if CourseCode already exists
            var existingCourse = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseCode == dto.CourseCode);
            if (existingCourse != null)
            {
                throw new InvalidOperationException($"Course code '{dto.CourseCode}' is already in use by another course.");
            }

            course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                CourseCode = dto.CourseCode,
                InstructorId = dto.InstructorId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Check if it's a unique constraint violation for CourseCode
            if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2601)
            {
                throw new InvalidOperationException($"Course code '{dto.CourseCode}' is already in use by another course.");
            }
            throw;
        }

        return await GetByIdAsync(course.Id) ?? throw new InvalidOperationException("Failed to retrieve created course");
    }

    public async Task<CourseDto?> UpdateAsync(int id, UpdateCourseDto dto)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return null;

        // Check if CourseCode is being updated and if it conflicts with existing courses
        if (!string.IsNullOrEmpty(dto.CourseCode) && dto.CourseCode != course.CourseCode)
        {
            var existingCourse = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseCode == dto.CourseCode && c.Id != id);
            if (existingCourse != null)
            {
                throw new InvalidOperationException($"Course code '{dto.CourseCode}' is already in use by another course.");
            }
        }

        if (!string.IsNullOrEmpty(dto.Title))
            course.Title = dto.Title;
        if (!string.IsNullOrEmpty(dto.Description))
            course.Description = dto.Description;
        if (!string.IsNullOrEmpty(dto.CourseCode))
            course.CourseCode = dto.CourseCode;
        if (dto.InstructorId.HasValue)
            course.InstructorId = dto.InstructorId.Value;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return false;

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Courses
            .AsNoTracking()
            .AnyAsync(c => c.Id == id);
    }

    public async Task<int> GetCurrentEnrollmentsCountAsync(int courseId)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .CountAsync(e => e.CourseId == courseId);
    }
}
