using backend.src.Application.Patients.DTOs;
using backend.src.Application.Patients.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientsController(IPatientService service)
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
        var results = await _service.GetLatestMeasurementsAsync(id);
        return Ok(results);
    }
}
