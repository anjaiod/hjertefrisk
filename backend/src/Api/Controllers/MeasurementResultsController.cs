using backend.src.Application.MeasurementResults.DTOs;
using backend.src.Application.MeasurementResults.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeasurementResultsController : ControllerBase
{
    private readonly IMeasurementResultService _service;

    public MeasurementResultsController(IMeasurementResultService service)
    {
        _service = service;
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk([FromBody] List<CreateMeasurementResultDto> dtos)
    {
        if (dtos == null || !dtos.Any())
            return BadRequest(new { error = "No measurements provided" });

        var created = await _service.UpsertManyAsync(dtos);
        return Ok(created);
    }
}
