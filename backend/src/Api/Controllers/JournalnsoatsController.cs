using backend.src.Application.Authorization.Interfaces;
using backend.src.Application.Journalnots.DTOs;
using backend.src.Application.Journalnots.Interfaces;
using backend.src.Infrastructure.Auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JournalnsoatsController : ControllerBase
{
    private readonly IJournalnotatService _service;
    private readonly IAccessAuthorizationService _authService;

    public JournalnsoatsController(IJournalnotatService service, IAccessAuthorizationService authService)
    {
        _service = service;
        _authService = authService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByPatientId([FromQuery] int patientId)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue)
            return BadRequest(new { error = "Could not identify personnel" });

        var canAccess = await _authService.CanAccessPatientAsync(personnelId.Value, patientId);
        if (!canAccess)
            return Forbid();

        var items = await _service.GetByPatientIdAsync(patientId, personnelId.Value);
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJournalnotatDto dto)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue)
            return BadRequest(new { error = "Could not identify personnel" });

        var canAccess = await _authService.CanAccessPatientAsync(personnelId.Value, dto.PatientId);
        if (!canAccess)
            return Forbid();

        var created = await _service.CreateAsync(dto, personnelId.Value);
        return Created(string.Empty, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateJournalnotatDto dto)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue)
            return BadRequest(new { error = "Could not identify personnel" });

        var updated = await _service.UpdateAsync(id, dto, personnelId.Value);
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue)
            return BadRequest(new { error = "Could not identify personnel" });

        var deleted = await _service.DeleteAsync(id, personnelId.Value);
        if (!deleted)
            return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/sign")]
    public async Task<IActionResult> Sign(int id)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId))
            return Unauthorized(new { error = "Missing Authorization header" });

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue)
            return BadRequest(new { error = "Could not identify personnel" });

        var signed = await _service.SignAsync(id, personnelId.Value);
        if (signed == null)
            return NotFound();

        return Ok(signed);
    }
}
