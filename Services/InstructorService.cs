using Microsoft.EntityFrameworkCore;
using WebProject.Database;
using WebProject.DTOs;
using WebProject.Interfaces;
using WebProject.Models;

namespace WebProject.Services;

public class InstructorService : IInstructorService
{
    private readonly ApplicationDbContext _context;

    public InstructorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InstructorDto?> GetByIdAsync(int id)
    {
        return await _context.Instructors
            .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(i => new InstructorDto
            {
                Id = i.Id,
                FirstName = i.FirstName,
                LastName = i.LastName,
                Email = i.Email,
                Department = i.Department,
                HireDate = i.HireDate,
                Profile = i.Profile == null ? null : new InstructorProfileDto
                {
                    Id = i.Profile.Id,
                    Bio = i.Profile.Bio,
                    OfficeLocation = i.Profile.OfficeLocation,
                    PhoneNumber = i.Profile.PhoneNumber,
                    Education = i.Profile.Education,
                    Specialization = i.Profile.Specialization
                }
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<InstructorListDto>> GetAllAsync()
    {
        return await _context.Instructors
            .AsNoTracking()
            .Select(i => new InstructorListDto
            {
                Id = i.Id,
                FullName = $"{i.FirstName} {i.LastName}",
                Email = i.Email,
                Department = i.Department
            })
            .ToListAsync();
    }

    public async Task<InstructorDto> CreateAsync(CreateInstructorDto dto)
    {
        var instructor = new Instructor
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Department = dto.Department,
            HireDate = dto.HireDate
        };

        if (dto.Profile != null)
        {
            instructor.Profile = new InstructorProfile
            {
                Bio = dto.Profile.Bio,
                OfficeLocation = dto.Profile.OfficeLocation,
                PhoneNumber = dto.Profile.PhoneNumber,
                Education = dto.Profile.Education,
                Specialization = dto.Profile.Specialization
            };
        }

        _context.Instructors.Add(instructor);
        await _context.SaveChangesAsync();

        return new InstructorDto
        {
            Id = instructor.Id,
            FirstName = instructor.FirstName,
            LastName = instructor.LastName,
            Email = instructor.Email,
            Department = instructor.Department,
            HireDate = instructor.HireDate,
            Profile = instructor.Profile == null ? null : new InstructorProfileDto
            {
                Id = instructor.Profile.Id,
                Bio = instructor.Profile.Bio,
                OfficeLocation = instructor.Profile.OfficeLocation,
                PhoneNumber = instructor.Profile.PhoneNumber,
                Education = instructor.Profile.Education,
                Specialization = instructor.Profile.Specialization
            }
        };
    }

    public async Task<InstructorDto?> UpdateAsync(int id, UpdateInstructorDto dto)
    {
        var instructor = await _context.Instructors
            .Include(i => i.Profile)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (instructor == null)
            return null;

        if (dto.FirstName != null)
            instructor.FirstName = dto.FirstName;
        if (dto.LastName != null)
            instructor.LastName = dto.LastName;
        if (dto.Email != null)
            instructor.Email = dto.Email;
        if (dto.Department != null)
            instructor.Department = dto.Department;

        if (dto.Profile != null)
        {
            if (instructor.Profile == null)
            {
                instructor.Profile = new InstructorProfile();
            }
            if (dto.Profile.Bio != null)
                instructor.Profile.Bio = dto.Profile.Bio;
            if (dto.Profile.OfficeLocation != null)
                instructor.Profile.OfficeLocation = dto.Profile.OfficeLocation;
            if (dto.Profile.PhoneNumber != null)
                instructor.Profile.PhoneNumber = dto.Profile.PhoneNumber;
            if (dto.Profile.Education != null)
                instructor.Profile.Education = dto.Profile.Education;
            if (dto.Profile.Specialization != null)
                instructor.Profile.Specialization = dto.Profile.Specialization;
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var instructor = await _context.Instructors.FindAsync(id);
        if (instructor == null)
            return false;

        _context.Instructors.Remove(instructor);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Instructors
            .AsNoTracking()
            .AnyAsync(i => i.Id == id);
    }
}
