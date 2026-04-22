using backend.src.Application.Responses.DTOs;
using backend.src.Application.Responses.Interfaces;
using backend.src.Application.Authorization.Interfaces;
using backend.src.Infrastructure.Auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResponsesController : ControllerBase
{
    private readonly IResponseService _service;
    private readonly IAccessAuthorizationService _authService;

    public ResponsesController(IResponseService service, IAccessAuthorizationService authService)
    {
        _service = service;
        _authService = authService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateResponseDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk([FromBody] List<CreateResponseDto> dtos)
    {
        if (dtos == null || !dtos.Any())
            return BadRequest(new { error = "No responses provided" });

        // If we have an authenticated Supabase user, attribute the AnsweredQuery to the correct actor.
        // This is critical for history pages ("Fylt inn av ...") to be accurate.
        var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
        int? personnelId = null;

        if (!string.IsNullOrWhiteSpace(supabaseUserId))
        {
            // If the user is personnel, store PersonnelId on AnsweredQuery.
            personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);

            // Optional access check: personnel must have access to the patient they're submitting for.
            if (personnelId.HasValue)
            {
                var patientId = dtos[0].PatientId;
                var hasAccess = await _authService.CanAccessPatientAsync(personnelId.Value, patientId);
                if (!hasAccess)
                    return StatusCode(403, new { error = "Access denied" });
            }
        }

        var created = await _service.UpsertManyAsync(dtos, personnelId);
        return Ok(created);
    }
}
