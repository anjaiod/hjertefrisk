using backend.src.Application.QuickMeasures.DTOs;
using backend.src.Application.QuickMeasures.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuickMeasuresController : ControllerBase
{
    private readonly IQuickMeasureService _service;

    public QuickMeasuresController(IQuickMeasureService service)
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
    public async Task<IActionResult> Create([FromBody] CreateQuickMeasureDto dto)
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

    [HttpPost("evaluate")]
    public async Task<IActionResult> Evaluate([FromBody] EvaluateQuickMeasuresDto dto)
    {
        var results = await _service.EvaluateAsync(dto);
        return Ok(results);
    }
}
