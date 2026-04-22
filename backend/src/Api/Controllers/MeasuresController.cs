using backend.src.Application.Measures.DTOs;
using backend.src.Application.Measures.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeasuresController : ControllerBase
{
    private readonly IPatientMeasureService _patientMeasures;
    private readonly IPersonnelMeasureService _personnelMeasures;
    private readonly IMeasureEvaluationService _evaluationService;

    public MeasuresController(
        IPatientMeasureService patientMeasures,
        IPersonnelMeasureService personnelMeasures,
        IMeasureEvaluationService evaluationService)
    {
        _patientMeasures = patientMeasures;
        _personnelMeasures = personnelMeasures;
        _evaluationService = evaluationService;
    }

    [HttpGet("patient")]
    public async Task<IActionResult> GetPatientMeasures()
    {
        var items = await _patientMeasures.GetAllAsync();
        return Ok(items);
    }

    [HttpPost("patient")]
    public async Task<IActionResult> CreatePatientMeasure([FromBody] CreatePatientMeasureDto dto)
    {
        try
        {
            var created = await _patientMeasures.CreateAsync(dto);
            return Created(string.Empty, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("personnel")]
    public async Task<IActionResult> GetPersonnelMeasures()
    {
        var items = await _personnelMeasures.GetAllAsync();
        return Ok(items);
    }

    [HttpPost("personnel")]
    public async Task<IActionResult> CreatePersonnelMeasure([FromBody] CreatePersonnelMeasureDto dto)
    {
        try
        {
            var created = await _personnelMeasures.CreateAsync(dto);
            return Created(string.Empty, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("evaluate")]
    public async Task<IActionResult> Evaluate([FromBody] EvaluateMeasuresDto dto)
    {
        var result = await _evaluationService.EvaluateAsync(dto);
        return Ok(result);
    }
}
