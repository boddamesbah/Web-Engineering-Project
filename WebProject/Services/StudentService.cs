using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
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
                StudentId = s.StudentId,
                FirstName = s.FirstName,
                LastName = s.LastName,
                Email = s.Email,
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
                StudentId = s.StudentId,
                FullName = $"{s.FirstName} {s.LastName}",
                Email = s.Email,
                Enrollments = s.Enrollments.Select(e => new EnrollmentListDto
                {
                    Id = e.Id,
                    EnrollmentDate = e.EnrollmentDate,
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
                StudentId = s.StudentId,
                FullName = $"{s.FirstName} {s.LastName}",
                Email = s.Email
            })
            .ToListAsync();
    }

    public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
    {
        Student student;
        
        try
        {
            // Check if Student ID already exists
            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId);
            if (existingStudent != null)
            {
                throw new InvalidOperationException($"Student ID '{dto.StudentId}' is already in use by another student.");
            }

            student = new Student
            {
                StudentId = dto.StudentId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                EnrollmentDate = dto.EnrollmentDate
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Check if it's a unique constraint violation for Student ID
            if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2601)
            {
                throw new InvalidOperationException($"Student ID '{dto.StudentId}' is already in use by another student.");
            }
            throw;
        }

        return new StudentDto
        {
            Id = student.Id,
            StudentId = student.StudentId,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            EnrollmentDate = student.EnrollmentDate
        };
    }

    public async Task<StudentDto?> UpdateAsync(int id, UpdateStudentDto dto)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return null;

        // Check if StudentId is being updated and if it conflicts with existing students
        if (!string.IsNullOrEmpty(dto.StudentId) && dto.StudentId != student.StudentId)
        {
            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId);
            if (existingStudent != null)
            {
                throw new InvalidOperationException($"Student ID '{dto.StudentId}' is already in use by another student.");
            }
            student.StudentId = dto.StudentId;
        }

        if (!string.IsNullOrEmpty(dto.FirstName))
            student.FirstName = dto.FirstName;
        if (!string.IsNullOrEmpty(dto.LastName))
            student.LastName = dto.LastName;
        if (!string.IsNullOrEmpty(dto.Email))
            student.Email = dto.Email;

        await _context.SaveChangesAsync();

        return new StudentDto
        {
            Id = student.Id,
            StudentId = student.StudentId,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
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
