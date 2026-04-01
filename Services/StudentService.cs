using Microsoft.EntityFrameworkCore;
using WebProject.Database;
using WebProject.DTOs;
using WebProject.Interfaces;
using WebProject.Models;

namespace WebProject.Services;

public class StudentService : IStudentService
{
    private readonly ApplicationDbContext _context;

    public StudentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentDto?> GetByIdAsync(int id)
    {
        return await _context.Students
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new StudentDto
            {
                Id = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                Email = s.Email,
                StudentNumber = s.StudentNumber,
                EnrollmentDate = s.EnrollmentDate
            })
            .FirstOrDefaultAsync();
    }

    public async Task<StudentWithEnrollmentsDto?> GetByIdWithEnrollmentsAsync(int id)
    {
        return await _context.Students
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new StudentWithEnrollmentsDto
            {
                Id = s.Id,
                FullName = $"{s.FirstName} {s.LastName}",
                Email = s.Email,
                StudentNumber = s.StudentNumber,
                Enrollments = s.Enrollments.Select(e => new EnrollmentListDto
                {
                    Id = e.Id,
                    EnrollmentDate = e.EnrollmentDate,
                    Status = e.Status.ToString(),
                    Grade = e.Grade
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<StudentListDto>> GetAllAsync()
    {
        return await _context.Students
            .AsNoTracking()
            .Select(s => new StudentListDto
            {
                Id = s.Id,
                FullName = $"{s.FirstName} {s.LastName}",
                Email = s.Email,
                StudentNumber = s.StudentNumber
            })
            .ToListAsync();
    }

    public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
    {
        var student = new Student
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            StudentNumber = dto.StudentNumber,
            EnrollmentDate = dto.EnrollmentDate
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            StudentNumber = student.StudentNumber,
            EnrollmentDate = student.EnrollmentDate
        };
    }

    public async Task<StudentDto?> UpdateAsync(int id, UpdateStudentDto dto)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return null;

        if (dto.FirstName != null)
            student.FirstName = dto.FirstName;
        if (dto.LastName != null)
            student.LastName = dto.LastName;
        if (dto.Email != null)
            student.Email = dto.Email;
        if (dto.StudentNumber != null)
            student.StudentNumber = dto.StudentNumber;

        await _context.SaveChangesAsync();

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            StudentNumber = student.StudentNumber,
            EnrollmentDate = student.EnrollmentDate
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return false;

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Students
            .AsNoTracking()
            .AnyAsync(s => s.Id == id);
    }
}
