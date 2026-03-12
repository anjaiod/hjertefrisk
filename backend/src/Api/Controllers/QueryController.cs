using backend.src.Application.Queries.DTOs;
using backend.src.Application.Queries.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QueryController : ControllerBase
{
	private readonly IQueryService _service;

	public QueryController(IQueryService service)
	{
		_service = service;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var items = await _service.GetAllAsync();
		return Ok(items);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetById(int id)
	{
		var item = await _service.GetByIdAsync(id);
		if (item == null) return NotFound();
		return Ok(item);
	}

	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreateQueryDto dto)
	{
		var created = await _service.CreateAsync(dto);
		return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
	}
}
