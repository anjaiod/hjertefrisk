using backend.src.Application.Severities.DTOs;
using backend.src.Application.Severities.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeveritiesController : ControllerBase
{
    private readonly ISeverityService _service;

    public SeveritiesController(ISeverityService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSeverityDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto);
            return Created(string.Empty, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
