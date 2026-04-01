using System.ComponentModel.DataAnnotations;

namespace WebProject.DTOs;

// Instructor DTOs
public class CreateInstructorDto
{
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

    [Required(ErrorMessage = "Department is required")]
    [MaxLength(50, ErrorMessage = "Department cannot exceed 50 characters")]
    public string Department { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hire date is required")]
    public DateTime HireDate { get; set; }

    public CreateInstructorProfileDto? Profile { get; set; }
}

public class UpdateInstructorDto
{
    [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string? FirstName { get; set; }

    [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string? LastName { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    public string? Email { get; set; }

    [MaxLength(50, ErrorMessage = "Department cannot exceed 50 characters")]
    public string? Department { get; set; }

    public UpdateInstructorProfileDto? Profile { get; set; }
}

public class InstructorDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public InstructorProfileDto? Profile { get; set; }
}

public class InstructorListDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
}
