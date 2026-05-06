namespace WebProject.Models;

public enum EnrollmentStatus
{
    Pending,
    Enrolled,
    Completed,
    Dropped
}

public class Enrollment
{
    public int Id { get; set; }
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    public decimal? Grade { get; set; }

    // Many-to-Many relationship via junction table
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
}
