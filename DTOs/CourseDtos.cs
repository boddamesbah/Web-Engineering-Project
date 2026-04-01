using System.ComponentModel.DataAnnotations;
using WebProject.Models;

namespace WebProject.DTOs;

// Course DTOs
public class CreateCourseDto
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Course code is required")]
    [MaxLength(10, ErrorMessage = "Course code cannot exceed 10 characters")]
    public string CourseCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Credits are required")]
    [Range(1, 10, ErrorMessage = "Credits must be between 1 and 10")]
    public int Credits { get; set; }

    [Required(ErrorMessage = "Max capacity is required")]
    [Range(1, 500, ErrorMessage = "Max capacity must be between 1 and 500")]
    public int MaxCapacity { get; set; }

    [Required(ErrorMessage = "Start date is required")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "End date is required")]
    public DateTime EndDate { get; set; }

    [Required(ErrorMessage = "Instructor ID is required")]
    public int InstructorId { get; set; }
}

public class UpdateCourseDto
{
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string? Title { get; set; }

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    [Range(1, 10, ErrorMessage = "Credits must be between 1 and 10")]
    public int? Credits { get; set; }

    [Range(1, 500, ErrorMessage = "Max capacity must be between 1 and 500")]
    public int? MaxCapacity { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public int? InstructorId { get; set; }
}

public class CourseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public int Credits { get; set; }
    public int MaxCapacity { get; set; }
    public int CurrentEnrollments { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public InstructorListDto Instructor { get; set; } = null!;
}

public class CourseListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string InstructorName { get; set; } = string.Empty;
}

public class CourseWithEnrollmentsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public int Credits { get; set; }
    public int MaxCapacity { get; set; }
    public int CurrentEnrollments { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public InstructorListDto Instructor { get; set; } = null!;
    public List<EnrollmentListDto> Enrollments { get; set; } = new();
}
