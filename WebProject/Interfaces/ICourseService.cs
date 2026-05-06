using WebProject.DTOs;

namespace WebProject.Interfaces;

public interface ICourseService
{
    Task<CourseDto?> GetByIdAsync(int id);
    Task<CourseWithEnrollmentsDto?> GetByIdWithEnrollmentsAsync(int id);
    Task<IEnumerable<CourseListDto>> GetAllAsync();
    Task<IEnumerable<CourseListDto>> GetByInstructorAsync(int instructorId);
    Task<CourseDto> CreateAsync(CreateCourseDto dto);
    Task<CourseDto?> UpdateAsync(int id, UpdateCourseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<int> GetCurrentEnrollmentsCountAsync(int courseId);
}
