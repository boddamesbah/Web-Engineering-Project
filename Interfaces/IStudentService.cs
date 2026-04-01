using WebProject.DTOs;

namespace WebProject.Interfaces;

public interface IStudentService
{
    Task<StudentDto?> GetByIdAsync(int id);
    Task<StudentWithEnrollmentsDto?> GetByIdWithEnrollmentsAsync(int id);
    Task<IEnumerable<StudentListDto>> GetAllAsync();
    Task<StudentDto> CreateAsync(CreateStudentDto dto);
    Task<StudentDto?> UpdateAsync(int id, UpdateStudentDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
