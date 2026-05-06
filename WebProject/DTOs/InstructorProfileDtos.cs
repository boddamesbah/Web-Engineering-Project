using System.ComponentModel.DataAnnotations;

namespace WebProject.DTOs;

// InstructorProfile DTOs
public class CreateInstructorProfileDto
{
    [MaxLength(500, ErrorMessage = "Bio cannot exceed 500 characters")]
    public string? Bio { get; set; }

    [MaxLength(100, ErrorMessage = "Office location cannot exceed 100 characters")]
    public string? OfficeLocation { get; set; }

    [Phone(ErrorMessage = "Invalid phone number")]
    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? PhoneNumber { get; set; }

    [MaxLength(200, ErrorMessage = "Education cannot exceed 200 characters")]
    public string? Education { get; set; }

    [MaxLength(100, ErrorMessage = "Specialization cannot exceed 100 characters")]
    public string? Specialization { get; set; }
}

public class UpdateInstructorProfileDto
{
    [MaxLength(500, ErrorMessage = "Bio cannot exceed 500 characters")]
    public string? Bio { get; set; }

    [MaxLength(100, ErrorMessage = "Office location cannot exceed 100 characters")]
    public string? OfficeLocation { get; set; }

    [Phone(ErrorMessage = "Invalid phone number")]
    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? PhoneNumber { get; set; }

    [MaxLength(200, ErrorMessage = "Education cannot exceed 200 characters")]
    public string? Education { get; set; }

    [MaxLength(100, ErrorMessage = "Specialization cannot exceed 100 characters")]
    public string? Specialization { get; set; }
}

public class InstructorProfileDto
{
    public int Id { get; set; }
    public string? Bio { get; set; }
    public string? OfficeLocation { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Education { get; set; }
    public string? Specialization { get; set; }
}
