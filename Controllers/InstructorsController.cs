using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebProject.DTOs;
using WebProject.Interfaces;

namespace WebProject.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InstructorsController : ControllerBase
{
    private readonly IInstructorService _instructorService;

    public InstructorsController(IInstructorService instructorService)
    {
        _instructorService = instructorService;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<InstructorListDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<InstructorListDto>>> GetAll()
    {
        var instructors = await _instructorService.GetAllAsync();
        return Ok(instructors);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(InstructorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InstructorDto>> GetById(int id)
    {
        var instructor = await _instructorService.GetByIdAsync(id);
        if (instructor == null)
            return NotFound(new { message = "Instructor not found" });

        return Ok(instructor);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(InstructorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<InstructorDto>> Create([FromBody] CreateInstructorDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var instructor = await _instructorService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = instructor.Id }, instructor);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Instructor")]
    [ProducesResponseType(typeof(InstructorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<InstructorDto>> Update(int id, [FromBody] UpdateInstructorDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var instructor = await _instructorService.UpdateAsync(id, dto);
        if (instructor == null)
            return NotFound(new { message = "Instructor not found" });

        return Ok(instructor);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _instructorService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Instructor not found" });

        return NoContent();
    }
}
