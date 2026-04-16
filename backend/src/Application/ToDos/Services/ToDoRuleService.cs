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

        // Find all QuestionAnswerRules for this question
        var rules = await _db.QuestionAnswerRules
            .Where(r => r.QuestionId == response.QuestionId)
            .Include(r => r.Question)
            .ToListAsync();

        foreach (var rule in rules)
        {
            if (await MatchesRuleAsync(response, rule))
            {
                await CreateToDoFromRuleAsync(response.PatientId, rule);
            }
        }
    }

    public async Task ProcessCategoryRulesAsync(int patientId, int categoryId, int categoryScore)
    {
        // Find all CategoryScoreRules for this category
        var categoryRules = await _db.CategoryScoreRules
            .Where(r => r.CategoryId == categoryId)
            .ToListAsync();

        Console.WriteLine($"[ToDoRuleService] Processing CategoryScoreRules for category {categoryId}, score: {categoryScore}. Found {categoryRules.Count} rules");

        // Find all matching rules
        var matchingRules = categoryRules
            .Where(rule => MatchesCategoryRule(categoryScore, rule))
            .ToList();

        if (matchingRules.Count == 0)
        {
            Console.WriteLine($"[ToDoRuleService] No matching CategoryScoreRules for category {categoryId}");
            return;
        }

        // Find the highest threshold among matching rules
        var highestThreshold = matchingRules.Max(r => r.ScoreThreshold);
        Console.WriteLine($"[ToDoRuleService] Found {matchingRules.Count} matching rules, highest threshold: {highestThreshold}");

        // Only use rules with the highest threshold
        var rulesToUse = matchingRules.Where(r => r.ScoreThreshold == highestThreshold).ToList();
        Console.WriteLine($"[ToDoRuleService] Using {rulesToUse.Count} rule(s) with threshold {highestThreshold}");

        // Create a ToDo for each rule with the highest threshold
        foreach (var rule in rulesToUse)
        {
            Console.WriteLine($"[ToDoRuleService] Creating ToDo for CategoryScoreRule {rule.ToDoRuleId} with threshold {rule.ScoreThreshold}");
            await CreateToDoFromRuleAsync(patientId, rule);
        }
    }

    public async Task ProcessResponseWithScoreAsync(Response response, int? categoryScore)
    {
        if (response.QuestionId == null)
            return;

        Console.WriteLine($"[ToDoRuleService] Processing response for question {response.QuestionId} with categoryScore: {categoryScore}");

        // Find all QuestionAnswerRules for this question
        var questionRules = await _db.QuestionAnswerRules
            .Where(r => r.QuestionId == response.QuestionId)
            .Include(r => r.Question)
            .ToListAsync();

        Console.WriteLine($"[ToDoRuleService] Found {questionRules.Count} QuestionAnswerRules");

        foreach (var rule in questionRules)
        {
            if (await MatchesRuleAsync(response, rule, categoryScore))
            {
                Console.WriteLine($"[ToDoRuleService] QuestionAnswerRule {rule.ToDoRuleId} matched!");
                await CreateToDoFromRuleAsync(response.PatientId, rule);
            }
        }
    }

    public async Task<bool> MatchesRuleAsync(Response response, ToDoRule rule, int? categoryScore = null)
    {
        if (rule is QuestionAnswerRule qr)
            return MatchesQuestionRule(response, qr);

        if (rule is CategoryScoreRule cr)
            return MatchesCategoryRule(categoryScore, cr);

        return false;
    }

    private bool MatchesQuestionRule(Response response, QuestionAnswerRule rule)
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

        return false;
    }

    private bool MatchesCategoryRule(int? score, CategoryScoreRule rule)
    {
        if (score == null)
            return false;

        bool matches = rule.Operator switch
        {
            "=" => score == rule.ScoreThreshold,
            "!=" => score != rule.ScoreThreshold,
            "<" => score < rule.ScoreThreshold,
            ">" => score > rule.ScoreThreshold,
            "<=" => score <= rule.ScoreThreshold,
            ">=" => score >= rule.ScoreThreshold,
            _ => false
        };

        Console.WriteLine($"[ToDoRuleService.MatchesCategoryRule] score={score}, operator='{rule.Operator}', threshold={rule.ScoreThreshold} -> matches={matches}");

        return matches;
    }

    public async Task CreateToDoFromRuleAsync(int patientId, ToDoRule rule)
    {

        // Check if an unfinished ToDo already exists for this rule and patient
        var existingUnfinishedTodo = await _db.ToDos
            .FirstOrDefaultAsync(t =>
                t.ToDoRuleId == rule.ToDoRuleId &&
                t.PatientId == patientId &&
                !t.Finished);

        if (existingUnfinishedTodo != null)
        {
            return;
        }

        var todo = new ToDo
        {
            PatientId = patientId,
            PersonnelId = null,
            ToDoText = rule.ToDoText,
            Finished = false,
            Public = true,
            ToDoRuleId = rule.ToDoRuleId
        };

        _db.ToDos.Add(todo);
        await _db.SaveChangesAsync();
    }
}
