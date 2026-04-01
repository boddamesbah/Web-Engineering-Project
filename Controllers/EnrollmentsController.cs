using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebProject.DTOs;
using WebProject.Interfaces;

namespace WebProject.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentsController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<EnrollmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<EnrollmentDto>>> GetAll()
    {
        var enrollments = await _enrollmentService.GetAllAsync();
        return Ok(enrollments);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Instructor,Student")]
    [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<EnrollmentDto>> GetById(int id)
    {
        var enrollment = await _enrollmentService.GetByIdAsync(id);
        if (enrollment == null)
            return NotFound(new { message = "Enrollment not found" });

        return Ok(enrollment);
    }

    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Admin,Student")]
    [ProducesResponseType(typeof(IEnumerable<StudentEnrollmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<StudentEnrollmentDto>>> GetByStudent(int studentId)
    {
        var enrollments = await _enrollmentService.GetByStudentAsync(studentId);
        return Ok(enrollments);
    }

    [HttpGet("course/{courseId}")]
    [Authorize(Roles = "Admin,Instructor")]
    [ProducesResponseType(typeof(IEnumerable<CourseEnrollmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<CourseEnrollmentDto>>> GetByCourse(int courseId)
    {
        var enrollments = await _enrollmentService.GetByCourseAsync(courseId);
        return Ok(enrollments);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Student")]
    [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<EnrollmentDto>> Create([FromBody] CreateEnrollmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var enrollment = await _enrollmentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = enrollment.Id }, enrollment);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Instructor")]
    [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<EnrollmentDto>> Update(int id, [FromBody] UpdateEnrollmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var enrollment = await _enrollmentService.UpdateAsync(id, dto);
        if (enrollment == null)
            return NotFound(new { message = "Enrollment not found" });

        return Ok(enrollment);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _enrollmentService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Enrollment not found" });

        return NoContent();
    }
}
