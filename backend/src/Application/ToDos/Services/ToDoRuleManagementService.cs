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
        var questionRules = await _db.QuestionAnswerRules
            .AsNoTracking()
            .Select(r => MapToDto(r))
            .ToListAsync();

        var categoryRules = await _db.CategoryScoreRules
            .AsNoTracking()
            .Select(r => MapToDto(r))
            .ToListAsync();

        return questionRules.Concat(categoryRules);
    }

    public async Task<ToDoRuleDto?> GetByIdAsync(int id)
    {
        var questionRule = await _db.QuestionAnswerRules
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.ToDoRuleId == id);

        if (questionRule != null)
            return MapToDto(questionRule);

        var categoryRule = await _db.CategoryScoreRules
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.ToDoRuleId == id);

        return categoryRule == null ? null : MapToDto(categoryRule);
    }

    public async Task<IEnumerable<ToDoRuleDto>> GetByQuestionAsync(int questionId)
    {
        return await _db.QuestionAnswerRules
            .AsNoTracking()
            .Where(r => r.QuestionId == questionId)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<IEnumerable<ToDoRuleDto>> GetByCategoryAsync(int categoryId)
    {
        return await _db.CategoryScoreRules
            .AsNoTracking()
            .Where(r => r.CategoryId == categoryId)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<ToDoRuleDto> CreateAsync(CreateToDoRuleDto dto)
    {
        ToDoRule entity;

        if (dto.TriggerType == "Question")
        {
            entity = new QuestionAnswerRule
            {
                QuestionId = dto.QuestionId ?? throw new ArgumentNullException(nameof(dto.QuestionId), "QuestionId is required for Question trigger type"),
                RequiredOption = dto.RequiredOption,
                RequiredText = dto.RequiredText,
                RequiredValue = dto.RequiredValue,
                Operator = dto.Operator,
                ToDoText = dto.ToDoText.Trim(),
                Priority = dto.Priority
            };
        }
        else if (dto.TriggerType == "Category")
        {
            entity = new CategoryScoreRule
            {
                CategoryId = dto.CategoryId ?? throw new ArgumentNullException(nameof(dto.CategoryId), "CategoryId is required for Category trigger type"),
                ScoreThreshold = dto.ScoreThreshold ?? 0,
                Operator = dto.Operator,
                ToDoText = dto.ToDoText.Trim(),
                Priority = dto.Priority
            };
        }
        else
        {
            throw new ArgumentException($"Invalid trigger type: {dto.TriggerType}");
        }

        _db.Add(entity);
        await _db.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<ToDoRuleDto> UpdateAsync(int id, CreateToDoRuleDto dto)
    {
        ToDoRule? entity = null;

        // Try to find as Question rule
        var questionRule = await _db.QuestionAnswerRules.FirstOrDefaultAsync(r => r.ToDoRuleId == id);
        if (questionRule != null)
            entity = questionRule;
        else
        {
            // Try to find as Category rule
            var categoryRule = await _db.CategoryScoreRules.FirstOrDefaultAsync(r => r.ToDoRuleId == id);
            if (categoryRule != null)
                entity = categoryRule;
        }

        if (entity == null)
            throw new KeyNotFoundException($"ToDoRule with id {id} not found");

        // Update common properties
        entity.Operator = dto.Operator;
        entity.ToDoText = dto.ToDoText.Trim();
        entity.Priority = dto.Priority;

        // Update type-specific properties
        if (entity is QuestionAnswerRule qr)
        {
            qr.QuestionId = dto.QuestionId ?? throw new ArgumentNullException(nameof(dto.QuestionId));
            qr.RequiredOption = dto.RequiredOption;
            qr.RequiredText = dto.RequiredText;
            qr.RequiredValue = dto.RequiredValue;
        }
        else if (entity is CategoryScoreRule cr)
        {
            cr.CategoryId = dto.CategoryId ?? throw new ArgumentNullException(nameof(dto.CategoryId));
            cr.ScoreThreshold = dto.ScoreThreshold ?? 0;
        }

        await _db.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task DeleteAsync(int id)
    {
        ToDoRule? entity = null;

        var questionRule = await _db.QuestionAnswerRules.FirstOrDefaultAsync(r => r.ToDoRuleId == id);
        if (questionRule != null)
            entity = questionRule;
        else
        {
            var categoryRule = await _db.CategoryScoreRules.FirstOrDefaultAsync(r => r.ToDoRuleId == id);
            if (categoryRule != null)
                entity = categoryRule;
        }

        if (entity == null)
            throw new KeyNotFoundException($"ToDoRule with id {id} not found");

        _db.Remove(entity);
        await _db.SaveChangesAsync();
    }

    private static ToDoRuleDto MapToDto(QuestionAnswerRule rule)
    {
        return new ToDoRuleDto
        {
            ToDoRuleId = rule.ToDoRuleId,
            QuestionId = rule.QuestionId,
            TriggerType = "Question",
            RequiredOption = rule.RequiredOption,
            RequiredText = rule.RequiredText,
            RequiredValue = rule.RequiredValue,
            Operator = rule.Operator,
            ToDoText = rule.ToDoText,
            Priority = rule.Priority
        };
    }

    private static ToDoRuleDto MapToDto(CategoryScoreRule rule)
    {
        return new ToDoRuleDto
        {
            ToDoRuleId = rule.ToDoRuleId,
            CategoryId = rule.CategoryId,
            ScoreThreshold = rule.ScoreThreshold,
            TriggerType = "Category",
            Operator = rule.Operator,
            ToDoText = rule.ToDoText,
            Priority = rule.Priority
        };
    }

    private static ToDoRuleDto MapToDto(ToDoRule rule)
    {
        if (rule is QuestionAnswerRule qr)
            return MapToDto(qr);
        if (rule is CategoryScoreRule cr)
            return MapToDto(cr);

        throw new InvalidOperationException($"Unknown ToDoRule type: {rule.GetType().Name}");
    }
}
