using Microsoft.AspNetCore.Mvc;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Application.ToDos.DTOs;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoRuleController(IToDoRuleManagementService toDoRuleService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ToDoRuleDto>>> GetAll()
    {
        var rules = await toDoRuleService.GetAllAsync();
        return Ok(rules);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ToDoRuleDto>> GetById(int id)
    {
        var rule = await toDoRuleService.GetByIdAsync(id);
        if (rule == null)
            return NotFound();
        return Ok(rule);
    }

    [HttpGet("question/{questionId}")]
    public async Task<ActionResult<List<ToDoRuleDto>>> GetByQuestion(int questionId)
    {
        var rules = await toDoRuleService.GetByQuestionAsync(questionId);
        return Ok(rules);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<List<ToDoRuleDto>>> GetByCategory(int categoryId)
    {
        var rules = await toDoRuleService.GetByCategoryAsync(categoryId);
        return Ok(rules);
    }

    [HttpPost]
    public async Task<ActionResult<ToDoRuleDto>> Create(CreateToDoRuleDto dto)
    {
        var rule = await toDoRuleService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = rule.ToDoRuleId }, rule);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateToDoRuleDto dto)
    {
        var rule = await toDoRuleService.UpdateAsync(id, dto);
        if (rule == null)
            return NotFound();
        return Ok(rule);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await toDoRuleService.DeleteAsync(id);
        return NoContent();
    }
}
