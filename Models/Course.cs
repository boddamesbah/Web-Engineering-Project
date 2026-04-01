namespace WebProject.Models;

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public int Credits { get; set; }
    public int MaxCapacity { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    // One-to-Many relationship: Course has one Instructor
    public int InstructorId { get; set; }
    public Instructor Instructor { get; set; } = null!;

    // One-to-Many relationship: Course has many Enrollments
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
