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
                await CreateToDoFromRuleAsync(response, rule);
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

        foreach (var rule in categoryRules)
        {
            Console.WriteLine($"[ToDoRuleService] Checking CategoryScoreRule {rule.ToDoRuleId}: threshold={rule.ScoreThreshold}, operator={rule.Operator}");
            
            if (MatchesCategoryRule(categoryScore, rule))
            {
                Console.WriteLine($"[ToDoRuleService] CategoryScoreRule {rule.ToDoRuleId} matched! Creating single ToDo for this category");
                
                // Create a single ToDo for this category rule match (not one per response)
                var todo = new ToDo
                {
                    PatientId = patientId,
                    PersonnelId = null,
                    ToDoText = rule.ToDoText,
                    Finished = false,
                    Public = true
                };
                _db.ToDos.Add(todo);
            }
            else
            {
                Console.WriteLine($"[ToDoRuleService] CategoryScoreRule {rule.ToDoRuleId} did NOT match");
            }
        }

        if (categoryRules.Any(r => MatchesCategoryRule(categoryScore, r)))
        {
            await _db.SaveChangesAsync();
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
                await CreateToDoFromRuleAsync(response, rule);
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

    public async Task CreateToDoFromRuleAsync(Response response, ToDoRule rule)
    {
        var todo = new ToDo
        {
            PatientId = response.PatientId,
            PersonnelId = null,
            ToDoText = rule.ToDoText,
            Finished = false,
            Public = true
        };

        _db.ToDos.Add(todo);
        await _db.SaveChangesAsync();
    }
}
