using backend.src.Application.ToDos.DTOs;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.ToDos.Services;

public class ToDoRuleManagementService : IToDoRuleManagementService
{
    private readonly AppDbContext _db;

    public ToDoRuleManagementService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ToDoRuleDto>> GetAllAsync()
    {
        return await _db.ToDoRules
            .AsNoTracking()
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<ToDoRuleDto?> GetByIdAsync(int id)
    {
        var rule = await _db.ToDoRules
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.ToDoRuleId == id);

        return rule == null ? null : MapToDto(rule);
    }

    public async Task<IEnumerable<ToDoRuleDto>> GetByQuestionAsync(int questionId)
    {
        return await _db.ToDoRules
            .AsNoTracking()
            .Where(r => r.QuestionId == questionId)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<IEnumerable<ToDoRuleDto>> GetByCategoryAsync(int categoryId)
    {
        return await _db.ToDoRules
            .AsNoTracking()
            .Where(r => r.CategoryId == categoryId)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<ToDoRuleDto> CreateAsync(CreateToDoRuleDto dto)
    {
        var entity = new ToDoRule
        {
            QuestionId = dto.QuestionId,
            CategoryId = dto.CategoryId,
            ScoreThreshold = dto.ScoreThreshold,
            TriggerType = Enum.Parse<ToDoRuleType>(dto.TriggerType),
            RequiredOption = dto.RequiredOption,
            RequiredText = dto.RequiredText,
            RequiredValue = dto.RequiredValue,
            Operator = dto.Operator,
            ToDoText = dto.ToDoText.Trim(),
            Priority = dto.Priority,
            IsExclusive = dto.IsExclusive
        };

        _db.ToDoRules.Add(entity);
        await _db.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<ToDoRuleDto> UpdateAsync(int id, CreateToDoRuleDto dto)
    {
        var entity = await _db.ToDoRules.FirstOrDefaultAsync(r => r.ToDoRuleId == id);
        if (entity == null)
            throw new KeyNotFoundException($"ToDoRule with id {id} not found");

        entity.QuestionId = dto.QuestionId;
        entity.CategoryId = dto.CategoryId;
        entity.ScoreThreshold = dto.ScoreThreshold;
        entity.TriggerType = Enum.Parse<ToDoRuleType>(dto.TriggerType);
        entity.RequiredOption = dto.RequiredOption;
        entity.RequiredText = dto.RequiredText;
        entity.RequiredValue = dto.RequiredValue;
        entity.Operator = dto.Operator;
        entity.ToDoText = dto.ToDoText.Trim();
        entity.Priority = dto.Priority;
        entity.IsExclusive = dto.IsExclusive;

        await _db.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.ToDoRules.FirstOrDefaultAsync(r => r.ToDoRuleId == id);
        if (entity == null)
            throw new KeyNotFoundException($"ToDoRule with id {id} not found");

        _db.ToDoRules.Remove(entity);
        await _db.SaveChangesAsync();
    }

    private static ToDoRuleDto MapToDto(ToDoRule rule)
    {
        return new ToDoRuleDto
        {
            ToDoRuleId = rule.ToDoRuleId,
            QuestionId = rule.QuestionId,
            CategoryId = rule.CategoryId,
            ScoreThreshold = rule.ScoreThreshold,
            TriggerType = rule.TriggerType.ToString(),
            RequiredOption = rule.RequiredOption,
            RequiredText = rule.RequiredText,
            RequiredValue = rule.RequiredValue,
            Operator = rule.Operator,
            ToDoText = rule.ToDoText,
            Priority = rule.Priority,
            IsExclusive = rule.IsExclusive
        };
    }
}
