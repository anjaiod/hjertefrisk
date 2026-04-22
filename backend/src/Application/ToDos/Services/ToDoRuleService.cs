using backend.src.Application.ToDos.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.ToDos.Services;

public class ToDoRuleService : IToDoRuleService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ToDoRuleService> _logger;

    public ToDoRuleService(AppDbContext db, ILogger<ToDoRuleService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task ProcessResponseAsync(Response response)
    {
        // if (response.QuestionId == null)
        //     return;
        if (response == null)
            throw new ArgumentNullException(nameof(response));

        // Find all QuestionAnswerRules for this question
        var rules = await _db.QuestionAnswerRules
            .Where(r => r.QuestionId == response.QuestionId)
            .Include(r => r.Question)
            .ToListAsync();

        _logger.LogInformation(
            "Processing question ToDo rules. PatientId={PatientId}, QuestionId={QuestionId}, RuleCount={RuleCount}",
            response.PatientId,
            response.QuestionId,
            rules.Count);

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

        _logger.LogInformation(
            "Processing category ToDo rules. PatientId={PatientId}, CategoryId={CategoryId}, Score={Score}, RuleCount={RuleCount}",
            patientId,
            categoryId,
            categoryScore,
            categoryRules.Count);

        // Find all matching rules
        var matchingRules = categoryRules
            .Where(rule => MatchesCategoryRule(categoryScore, rule))
            .ToList();

        if (matchingRules.Count == 0)
        {
            _logger.LogInformation(
                "No matching category ToDo rules. PatientId={PatientId}, CategoryId={CategoryId}, Score={Score}",
                patientId,
                categoryId,
                categoryScore);
            return;
        }

        // Find the highest threshold among matching rules
        var highestThreshold = matchingRules.Max(r => r.ScoreThreshold);
        _logger.LogInformation(
            "Matched category ToDo rules. PatientId={PatientId}, CategoryId={CategoryId}, Score={Score}, MatchingRuleCount={MatchingRuleCount}, HighestThreshold={HighestThreshold}",
            patientId,
            categoryId,
            categoryScore,
            matchingRules.Count,
            highestThreshold);

        // Only use rules with the highest threshold
        var rulesToUse = matchingRules.Where(r => r.ScoreThreshold == highestThreshold).ToList();

        // Create a ToDo for each rule with the highest threshold
        foreach (var rule in rulesToUse)
        {
            _logger.LogInformation(
                "Creating ToDo from category rule. PatientId={PatientId}, CategoryId={CategoryId}, ToDoRuleId={ToDoRuleId}, ScoreThreshold={ScoreThreshold}",
                patientId,
                categoryId,
                rule.ToDoRuleId,
                rule.ScoreThreshold);
            await CreateToDoFromRuleAsync(patientId, rule);
        }
    }

    public async Task ProcessResponseWithScoreAsync(Response response, int? categoryScore)
    {
        // if (response.QuestionId == null)
        //     return;
        if (response == null)
            throw new ArgumentNullException(nameof(response));
        _logger.LogInformation(
            "Processing response with category score. PatientId={PatientId}, QuestionId={QuestionId}, CategoryScore={CategoryScore}",
            response.PatientId,
            response.QuestionId,
            categoryScore);

        // Find all QuestionAnswerRules for this question
        var questionRules = await _db.QuestionAnswerRules
            .Where(r => r.QuestionId == response.QuestionId)
            .Include(r => r.Question)
            .ToListAsync();

        _logger.LogInformation(
            "Found question ToDo rules. PatientId={PatientId}, QuestionId={QuestionId}, RuleCount={RuleCount}",
            response.PatientId,
            response.QuestionId,
            questionRules.Count);

        foreach (var rule in questionRules)
        {
            if (await MatchesRuleAsync(response, rule, categoryScore))
            {
                _logger.LogInformation(
                    "Matched question ToDo rule. PatientId={PatientId}, QuestionId={QuestionId}, ToDoRuleId={ToDoRuleId}",
                    response.PatientId,
                    response.QuestionId,
                    rule.ToDoRuleId);
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

        _logger.LogDebug(
            "Evaluated category ToDo rule. ToDoRuleId={ToDoRuleId}, Score={Score}, Operator={Operator}, ScoreThreshold={ScoreThreshold}, Matches={Matches}",
            rule.ToDoRuleId,
            score,
            rule.Operator,
            rule.ScoreThreshold,
            matches);

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
            _logger.LogInformation(
                "Skipped ToDo creation because unfinished ToDo already exists. PatientId={PatientId}, ToDoRuleId={ToDoRuleId}, ToDoId={ToDoId}",
                patientId,
                rule.ToDoRuleId,
                existingUnfinishedTodo.ToDoId);
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

        _logger.LogInformation(
            "Created ToDo from rule. PatientId={PatientId}, ToDoRuleId={ToDoRuleId}, ToDoId={ToDoId}",
            patientId,
            rule.ToDoRuleId,
            todo.ToDoId);
    }
}
