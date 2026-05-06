using System.ComponentModel.DataAnnotations;
using WebProject.Models;

namespace WebProject.DTOs;

// Enrollment DTOs
public class CreateEnrollmentDto
{
    [Required(ErrorMessage = "Student ID is required")]
    public int StudentId { get; set; }

    [Required(ErrorMessage = "Course ID is required")]
    public int CourseId { get; set; }

    [Range(0, 100, ErrorMessage = "Grade must be between 0 and 100")]
    public decimal? Grade { get; set; }
}

public class UpdateEnrollmentDto
{
    [Range(0, 100, ErrorMessage = "Grade must be between 0 and 100")]
    public decimal? Grade { get; set; }
}

public class EnrollmentDto
{
    public int Id { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public decimal? Grade { get; set; }
    public StudentListDto Student { get; set; } = null!;
    public CourseListDto Course { get; set; } = null!;
}

public class EnrollmentListDto
{
    public int Id { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public decimal? Grade { get; set; }
}

public class StudentEnrollmentDto
{
    public int Id { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public decimal? Grade { get; set; }
    public CourseListDto Course { get; set; } = null!;
}

public class CourseEnrollmentDto
{
    public int Id { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public decimal? Grade { get; set; }
    public StudentListDto Student { get; set; } = null!;
}
