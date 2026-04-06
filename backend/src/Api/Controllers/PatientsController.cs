using backend.src.Application.Patients.DTOs;
using backend.src.Application.MeasurementResults.DTOs;
using backend.src.Application.Patients.Interfaces;
using backend.src.Application.Responses.Interfaces;
using backend.src.Application.Responses.DTOs;
using backend.src.Application.MeasurementResults.Interfaces;
using backend.src.Application.Authorization.Interfaces;
using backend.src.Infrastructure.Auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;
    private readonly IAccessAuthorizationService _authService;
    private readonly IResponseService _responseService;
    private readonly IMeasurementResultService _measurementResultService;

    public PatientsController(
        IPatientService service,
        IAccessAuthorizationService authService,
        IResponseService responseService,
        IMeasurementResultService measurementResultService)
    {
        _service = service;
        _authService = authService;
        _responseService = responseService;
        _measurementResultService = measurementResultService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
            if (string.IsNullOrWhiteSpace(supabaseUserId))
                return Unauthorized(new { error = "Missing x-supabase-user-id header" });

            // Check if personnel
            var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
            if (personnelId.HasValue)
            {
                // Personnel: return only accessible patients
                var accessibleIds = await _authService.GetAccessiblePatientIdsAsync(personnelId.Value);
                var allPatients = await _service.GetAllAsync();
                var filtered = allPatients.Where(p => accessibleIds.Contains(p.Id)).ToList();
                return Ok(filtered);
            }

            // Check if patient
            var patientId = await _authService.GetPatientIdBySupabaseIdAsync(supabaseUserId);
            if (patientId.HasValue)
            {
                var patient = await _service.GetBySupabaseUserIdAsync(supabaseUserId);
                return patient == null ? Ok(new List<PatientDto>()) : Ok(new[] { patient });
            }

            return Unauthorized(new { error = "User not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet("by-supabase/{supabaseUserId}")]
    public async Task<IActionResult> GetBySupabaseUserId(string supabaseUserId)
    {
        var item = await _service.GetBySupabaseUserIdAsync(supabaseUserId);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePatientDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }

    [HttpGet("{id:int}/score")]
    public async Task<IActionResult> GetTotalScore(int id)
    {
        var totalScore = await _service.GetTotalScoreAsync(id);
        return Ok(new { patientId = id, totalScore });
    }

    [HttpGet("{id:int}/latest-measurements")]
    public async Task<IActionResult> GetLatestMeasurements(int id)
    {
        try
        {
            var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
            if (string.IsNullOrWhiteSpace(supabaseUserId))
                return Unauthorized(new { error = "Missing x-supabase-user-id header" });

            // Check if user is the patient themselves
            var patientIdForUser = await _authService.GetPatientIdBySupabaseIdAsync(supabaseUserId);
            if (patientIdForUser.HasValue && patientIdForUser.Value == id)
            {
                var results = await _service.GetLatestMeasurementsAsync(id);
                return Ok(results);
            }

            // Check if personnel has access
            var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
            if (personnelId.HasValue)
            {
                var hasAccess = await _authService.CanAccessPatientAsync(personnelId.Value, id);
                if (!hasAccess)
                    return Forbid();

                var results = await _service.GetLatestMeasurementsAsync(id);
                return Ok(results);
            }

            return Unauthorized(new { error = "User not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet("{id:int}/all-measurements")]
    public async Task<IActionResult> GetAllMeasurements(int id)
    {
        try
        {
            var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
            if (string.IsNullOrWhiteSpace(supabaseUserId))
                return Unauthorized(new { error = "Missing x-supabase-user-id header" });

            // Check if user is the patient themselves
            var patientIdForUser = await _authService.GetPatientIdBySupabaseIdAsync(supabaseUserId);
            if (patientIdForUser.HasValue && patientIdForUser.Value == id)
            {
                var results = await _service.GetAllMeasurementsAsync(id);
                return Ok(results);
            }

            // Check if personnel has access
            var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
            if (personnelId.HasValue)
            {
                var hasAccess = await _authService.CanAccessPatientAsync(personnelId.Value, id);
                if (!hasAccess)
                    return Forbid();

                var results = await _service.GetAllMeasurementsAsync(id);
                return Ok(results);
            }

            return Unauthorized(new { error = "User not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpPost("{id:int}/responses")]
    public async Task<IActionResult> CreateResponses(int id, [FromBody] List<CreateResponseDto> dtos)
    {
        try
        {
            var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
            if (string.IsNullOrWhiteSpace(supabaseUserId))
                return Unauthorized(new { error = "Missing x-supabase-user-id header" });

            // Verify all responses are for the patient in the URL
            if (dtos.Any(d => d.PatientId != id))
                return BadRequest(new { error = "All responses must be for the specified patient" });

            // Check if personnel has access
            var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
            if (personnelId.HasValue)
            {
                var hasAccess = await _authService.CanAccessPatientAsync(personnelId.Value, id);
                if (!hasAccess)
                    return Forbid();
            }
            else
            {
                // If not personnel, check if they're the patient themselves
                var patientIdForUser = await _authService.GetPatientIdBySupabaseIdAsync(supabaseUserId);
                if (!patientIdForUser.HasValue || patientIdForUser.Value != id)
                    return Unauthorized(new { error = "User not found" });
            }

            var created = await _responseService.UpsertManyAsync(dtos);
            return Ok(created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpPost("{id:int}/measurements")]
    public async Task<IActionResult> CreateMeasurements(int id, [FromBody] List<CreateMeasurementResultDto> dtos)
    {
        try
        {
            var supabaseUserId = HttpContext.GetSupabaseUserIdFromContext();
            if (string.IsNullOrWhiteSpace(supabaseUserId))
                return Unauthorized(new { error = "Missing x-supabase-user-id header" });

            // Verify all measurements are for the patient in the URL
            if (dtos.Any(d => d.PatientId != id))
                return BadRequest(new { error = "All measurements must be for the specified patient" });

            // Check if personnel has access
            var personnelId = await _authService.GetPersonnelIdBySupabaseIdAsync(supabaseUserId);
            if (personnelId.HasValue)
            {
                var hasAccess = await _authService.CanAccessPatientAsync(personnelId.Value, id);
                if (!hasAccess)
                    return Forbid();
            }
            else
            {
                // If not personnel, check if they're the patient themselves
                var patientIdForUser = await _authService.GetPatientIdBySupabaseIdAsync(supabaseUserId);
                if (!patientIdForUser.HasValue || patientIdForUser.Value != id)
                    return Unauthorized(new { error = "User not found" });
            }

            var created = await _measurementResultService.UpsertManyAsync(dtos);
            return Ok(created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }
}
