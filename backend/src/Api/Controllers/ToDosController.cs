using backend.src.Application.ToDos.DTOs;
using backend.src.Application.ToDos.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDosController : ControllerBase
{
    private readonly IToDoService _service;

    public ToDosController(IToDoService service)
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
    public async Task<IActionResult> Create([FromBody] CreateToDoDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateToDoDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }
}
