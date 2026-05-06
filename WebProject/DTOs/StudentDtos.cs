using System.ComponentModel.DataAnnotations;

namespace WebProject.DTOs;

// Student DTOs
public class CreateStudentDto
{
    [Required(ErrorMessage = "Student ID is required")]
    [MaxLength(20, ErrorMessage = "Student ID cannot exceed 20 characters")]
    public string StudentId { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Enrollment date is required")]
    public DateTime EnrollmentDate { get; set; }
}

public class UpdateStudentDto
{
    [MaxLength(20, ErrorMessage = "Student ID cannot exceed 20 characters")]
    public string? StudentId { get; set; }

    [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string? FirstName { get; set; }

    [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string? LastName { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    public string? Email { get; set; }
}

public class StudentDto
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
}

public class StudentListDto
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class StudentWithEnrollmentsDto
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<EnrollmentListDto> Enrollments { get; set; } = new();
}
