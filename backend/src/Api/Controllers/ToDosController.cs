using backend.src.Application.Authorization.Interfaces;
using backend.src.Application.ToDos.DTOs;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Infrastructure.Auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDosController : ControllerBase
{
    private readonly IToDoService _service;
    private readonly IAccessAuthorizationService _authService;

    public ToDosController(IToDoService service, IAccessAuthorizationService authService)
    {
        _service = service;
        _authService = authService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        var items = await _service.GetAllAsync(personnelId);
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateToDoDto dto)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue)
            return BadRequest(new { error = "Could not identify personnel" });

        dto.PersonnelId = personnelId.Value;
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateToDoDto dto)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        var updated = await _service.UpdateAsync(id, dto, personnelId);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
