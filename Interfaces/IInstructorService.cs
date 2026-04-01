using WebProject.DTOs;

namespace WebProject.Interfaces;

public interface IInstructorService
{
    Task<InstructorDto?> GetByIdAsync(int id);
    Task<IEnumerable<InstructorListDto>> GetAllAsync();
    Task<InstructorDto> CreateAsync(CreateInstructorDto dto);
    Task<InstructorDto?> UpdateAsync(int id, UpdateInstructorDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
