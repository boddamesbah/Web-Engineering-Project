using WebProject.DTOs;
using WebProject.Models;

namespace WebProject.Interfaces;

public interface IEnrollmentService
{
    Task<EnrollmentDto?> GetByIdAsync(int id);
    Task<IEnumerable<EnrollmentDto>> GetAllAsync();
    Task<IEnumerable<StudentEnrollmentDto>> GetByStudentAsync(int studentId);
    Task<IEnumerable<CourseEnrollmentDto>> GetByCourseAsync(int courseId);
    Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto dto);
    Task<EnrollmentDto?> UpdateAsync(int id, UpdateEnrollmentDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> IsStudentEnrolledAsync(int studentId, int courseId);
}
