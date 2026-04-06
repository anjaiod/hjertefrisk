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
}
