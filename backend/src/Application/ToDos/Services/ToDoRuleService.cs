using backend.src.Application.ToDos.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.ToDos.Services;

public class ToDoRuleService : IToDoRuleService
{
    private readonly AppDbContext _db;

    public ToDoRuleService(AppDbContext db)
    {
        _db = db;
    }

    public async Task ProcessResponseAsync(Response response)
    {
        if (response.QuestionId == null)
            return;

        // Find all ToDoRules for this question
        var rules = await _db.ToDoRules
            .Where(r => r.QuestionId == response.QuestionId && r.TriggerType == ToDoRuleType.Question)
            .Include(r => r.Question)
            .ToListAsync();

        foreach (var rule in rules)
        {
            if (await MatchesRuleAsync(response, rule))
            {
                await CreateToDoFromRuleAsync(response, rule);
            }
        }
    }

    public async Task ProcessResponseWithScoreAsync(Response response, int? categoryScore)
    {
        if (response.QuestionId == null)
            return;

        // Find all ToDoRules for this question
        var rules = await _db.ToDoRules
            .Where(r => r.QuestionId == response.QuestionId && r.TriggerType == ToDoRuleType.Question)
            .Include(r => r.Question)
            .ToListAsync();

        foreach (var rule in rules)
        {
            if (await MatchesRuleAsync(response, rule, categoryScore))
            {
                await CreateToDoFromRuleAsync(response, rule);
            }
        }
    }

    public async Task<bool> MatchesRuleAsync(Response response, ToDoRule rule, int? categoryScore = null)
    {
        // Check if rule has a required answer condition
        if (rule.RequiredOption.HasValue)
        {
            // Option-based matching
            bool optionMatches = response.SelectedOptionId == rule.RequiredOption;
            return rule.Operator == "=" ? optionMatches : !optionMatches;
        }

        if (!string.IsNullOrWhiteSpace(rule.RequiredText))
        {
            // Text-based matching
            bool textMatches = response.TextValue?.Equals(rule.RequiredText, StringComparison.OrdinalIgnoreCase) ?? false;
            return rule.Operator == "=" ? textMatches : !textMatches;
        }

        if (rule.RequiredValue.HasValue)
        {
            // Numeric value matching
            if (response.NumberValue == null)
                return false;

            return rule.Operator switch
            {
                "=" => response.NumberValue == rule.RequiredValue,
                "!=" => response.NumberValue != rule.RequiredValue,
                "<" => response.NumberValue < rule.RequiredValue,
                ">" => response.NumberValue > rule.RequiredValue,
                "<=" => response.NumberValue <= rule.RequiredValue,
                ">=" => response.NumberValue >= rule.RequiredValue,
                _ => false
            };
        }

        if (rule.ScoreThreshold.HasValue)
        {
            // Score-based matching - use provided score or calculate it
            return MatchesCategoryScore(categoryScore, rule);
        }

        return false;
    }

    public async Task CreateToDoFromRuleAsync(Response response, ToDoRule rule)
    {
        var todo = new ToDo
        {
            PatientId = response.PatientId,
            PersonnelId = rule.AssignedPersonnelId,
            ToDoText = rule.ToDoText,
            Finished = false,
            Public = true
        };

        _db.ToDos.Add(todo);
        await _db.SaveChangesAsync();
    }

    private bool MatchesCategoryScore(int? score, ToDoRule rule)
    {
        if (score == null || !rule.ScoreThreshold.HasValue)
            return false;

        return rule.Operator switch
        {
            "=" => score == rule.ScoreThreshold,
            "!=" => score != rule.ScoreThreshold,
            "<" => score < rule.ScoreThreshold,
            ">" => score > rule.ScoreThreshold,
            "<=" => score <= rule.ScoreThreshold,
            ">=" => score >= rule.ScoreThreshold,
            _ => false
        };
    }
}
