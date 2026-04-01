namespace WebProject.Models;

public class InstructorProfile
{
    public int Id { get; set; }
    public string? Bio { get; set; }
    public string? OfficeLocation { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Education { get; set; }
    public string? Specialization { get; set; }

    // One-to-One relationship back to Instructor
    public int InstructorId { get; set; }
    public Instructor Instructor { get; set; } = null!;
}
