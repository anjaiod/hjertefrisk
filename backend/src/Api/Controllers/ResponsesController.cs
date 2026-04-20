using backend.src.Application.Responses.DTOs;
using backend.src.Application.Responses.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResponsesController : ControllerBase
{
    private readonly IResponseService _service;

    public ResponsesController(IResponseService service)
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

        var created = await _service.UpsertManyAsync(dtos);
        return Ok(created);
    }
}
