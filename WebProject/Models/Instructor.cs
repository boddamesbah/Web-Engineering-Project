namespace WebProject.Models;

public class Instructor
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }

    // One-to-One relationship with InstructorProfile
    public int? ProfileId { get; set; }
    public InstructorProfile? Profile { get; set; }

    // One-to-Many relationship: Instructor has many Courses
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
