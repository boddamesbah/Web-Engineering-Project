using Microsoft.EntityFrameworkCore;
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
                Credits = c.Credits,
                MaxCapacity = c.MaxCapacity,
                CurrentEnrollments = c.Enrollments.Count(e => e.Status != EnrollmentStatus.Dropped),
                StartDate = c.StartDate,
                EndDate = c.EndDate,
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
                Credits = c.Credits,
                MaxCapacity = c.MaxCapacity,
                CurrentEnrollments = c.Enrollments.Count(e => e.Status != EnrollmentStatus.Dropped),
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                Instructor = new InstructorListDto
                {
                    Id = c.Instructor.Id,
                    FullName = $"{c.Instructor.FirstName} {c.Instructor.LastName}",
                    Email = c.Instructor.Email,
                    Department = c.Instructor.Department
                },
                Enrollments = c.Enrollments
                    .Where(e => e.Status != EnrollmentStatus.Dropped)
                    .Select(e => new EnrollmentListDto
                    {
                        Id = e.Id,
                        EnrollmentDate = e.EnrollmentDate,
                        Status = e.Status.ToString(),
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
                Credits = c.Credits,
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
                Credits = c.Credits,
                InstructorName = $"{c.Instructor.FirstName} {c.Instructor.LastName}"
            })
            .ToListAsync();
    }

    public async Task<CourseDto> CreateAsync(CreateCourseDto dto)
    {
        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            CourseCode = dto.CourseCode,
            Credits = dto.Credits,
            MaxCapacity = dto.MaxCapacity,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            InstructorId = dto.InstructorId
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(course.Id) ?? throw new InvalidOperationException("Failed to retrieve created course");
    }

    public async Task<CourseDto?> UpdateAsync(int id, UpdateCourseDto dto)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return null;

        if (dto.Title != null)
            course.Title = dto.Title;
        if (dto.Description != null)
            course.Description = dto.Description;
        if (dto.Credits.HasValue)
            course.Credits = dto.Credits.Value;
        if (dto.MaxCapacity.HasValue)
            course.MaxCapacity = dto.MaxCapacity.Value;
        if (dto.StartDate.HasValue)
            course.StartDate = dto.StartDate.Value;
        if (dto.EndDate.HasValue)
            course.EndDate = dto.EndDate.Value;
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
            .CountAsync(e => e.CourseId == courseId && e.Status != EnrollmentStatus.Dropped);
    }
}
