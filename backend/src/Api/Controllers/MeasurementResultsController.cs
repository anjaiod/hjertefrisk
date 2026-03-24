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
    public async Task<IActionResult> UpsertBulk([FromBody] List<CreateMeasurementResultDto> dtos)
    {
        var results = await _service.UpsertManyAsync(dtos);
        return Ok(results);
    }
}
