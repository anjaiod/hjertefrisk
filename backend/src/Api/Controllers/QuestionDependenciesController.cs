using backend.src.Application.QuestionDependencies.DTOs;
using backend.src.Application.QuestionDependencies.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionDependenciesController : ControllerBase
{
    private readonly IQuestionDependencyService _service;

    public QuestionDependenciesController(IQuestionDependencyService service)
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
    public async Task<IActionResult> Create([FromBody] CreateQuestionDependencyDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }
}
