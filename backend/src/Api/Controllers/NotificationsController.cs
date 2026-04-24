using backend.src.Application.Notifications.DTOs;
using backend.src.Application.Notifications.Interfaces;
using backend.src.Infrastructure.Auth;
using backend.src.Application.Authorization.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;
    private readonly IAccessAuthorizationService _authService;

    public NotificationsController(INotificationService service, IAccessAuthorizationService authService)
    {
        _service = service;
        _authService = authService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllForCurrentPersonnel()
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId)) return Unauthorized();

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue) return Unauthorized();

        var items = await _service.GetForPersonnelAsync(personnelId.Value);
        return Ok(items);
    }

    [HttpPost("{id:int}/mark-read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId)) return Unauthorized();

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue) return Unauthorized();

        await _service.MarkAsReadAsync(id, personnelId.Value);
        return NoContent();
    }

    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllRead([FromQuery] int? patientId = null)
    {
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        if (string.IsNullOrWhiteSpace(supabaseUserId)) return Unauthorized();

        var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
        if (!personnelId.HasValue) return Unauthorized();

        await _service.MarkAllAsReadAsync(personnelId.Value, patientId);
        return NoContent();
    }
}
