using backend.src.Application.Measurements.DTOs;
using backend.src.Application.Measurements.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeasurementsController : ControllerBase
{
    private readonly IMeasurementService _service;

    public MeasurementsController(IMeasurementService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMeasurementDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }
}
