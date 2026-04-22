using backend.src.Application.QuestionOptions.DTOs;
using backend.src.Application.QuestionOptions.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionOptionsController : ControllerBase
{
    private readonly IQuestionOptionService _service;

    public QuestionOptionsController(IQuestionOptionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    [HttpGet("question/{questionId}")]
    public async Task<IActionResult> GetByQuestionId(int questionId)
    {
        var items = await _service.GetByQuestionIdAsync(questionId);
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateQuestionOptionDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }
}
