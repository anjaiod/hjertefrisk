using backend.src.Application.Personnel.DTOs;
using backend.src.Application.Personnel.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonnelController : ControllerBase
{
    private readonly IPersonnelService _service;

    public PersonnelController(IPersonnelService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    [HttpGet("by-supabase/{supabaseUserId}")]
    public async Task<IActionResult> GetBySupabaseUserId(string supabaseUserId)
    {
        var item = await _service.GetBySupabaseUserIdAsync(supabaseUserId);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePersonnelDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }
}
