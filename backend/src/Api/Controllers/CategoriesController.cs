using backend.src.Application.Categories.DTOs;
using backend.src.Application.Categories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
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
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created(string.Empty, created);
    }
}
