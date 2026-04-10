using backend.src.Application.Responses.DTOs;
using backend.src.Application.Responses.Interfaces;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Responses.Services;

public class ResponseService : IResponseService
{
    private readonly AppDbContext _db;
    private readonly IToDoRuleService _toDoRuleService;

    public ResponseService(AppDbContext db, IToDoRuleService toDoRuleService)
    {
        _db = db;
        _toDoRuleService = toDoRuleService;
    }

    public async Task<IEnumerable<ResponseDto>> GetAllAsync()
    {
        return await _db.Responses
            .AsNoTracking()
            .Select(r => new ResponseDto
            {
                AnsweredQueryId = r.AnsweredQueryId,
                PatientId = r.PatientId,
                QuestionId = r.QuestionId,
                SelectedOptionId = r.SelectedOptionId,
                TextValue = r.TextValue,
                NumberValue = r.NumberValue,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ResponseDto> CreateAsync(CreateResponseDto dto)
    {
        var answeredQuery = new AnsweredQuery { PatientId = dto.PatientId };
        var entity = new Response
        {
            AnsweredQuery = answeredQuery,
            PatientId = dto.PatientId,
            QuestionId = dto.QuestionId,
            SelectedOptionId = dto.SelectedOptionId,
            TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
            NumberValue = dto.NumberValue
        };

        _db.Responses.Add(entity);
        await _db.SaveChangesAsync();

        // Process ToDoRules for this response
        await _toDoRuleService.ProcessResponseAsync(entity);

        return new ResponseDto
        {
            AnsweredQueryId = entity.AnsweredQueryId,
            PatientId = entity.PatientId,
            QuestionId = entity.QuestionId,
            SelectedOptionId = entity.SelectedOptionId,
            TextValue = entity.TextValue,
            NumberValue = entity.NumberValue,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<IEnumerable<ResponseDto>> UpsertManyAsync(IEnumerable<CreateResponseDto> dtos)
    {
        var incoming = dtos.ToList();
        if (incoming.Count == 0)
            return Array.Empty<ResponseDto>();

        var patientId = incoming[0].PatientId;
        if (incoming.Any(x => x.PatientId != patientId))
            throw new ArgumentException("All responses in one bulk request must belong to the same patient.");

        var normalized = incoming
            .GroupBy(x => x.QuestionId)
            .Select(g => g.Last())
            .ToList();

        await using var transaction = await _db.Database.BeginTransactionAsync();

        var answeredQuery = new AnsweredQuery { PatientId = patientId };

        var entities = normalized.Select(dto => new Response
        {
            AnsweredQuery = answeredQuery,
            PatientId = patientId,
            QuestionId = dto.QuestionId,
            SelectedOptionId = dto.SelectedOptionId,
            TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
            NumberValue = dto.NumberValue
        }).ToList();

        _db.Responses.AddRange(entities);
        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        // Build a map of question IDs to their categories for score-based rules
        var questionIds = entities.Select(e => e.QuestionId).Distinct().ToList();
        var questionsWithCategories = await _db.Questions
            .AsNoTracking()
            .Where(q => questionIds.Contains(q.QuestionId))
            .Select(q => new { q.QuestionId, q.CategoryId })
            .ToListAsync();

        // Pre-calculate category scores once per category
        var categoryScoreMap = new Dictionary<int, int>();
        var categoriesInBatch = questionsWithCategories
            .Where(q => q.CategoryId.HasValue)
            .Select(q => q.CategoryId.Value)
            .Distinct()
            .ToList();

        foreach (var categoryId in categoriesInBatch)
        {
            // Get only the responses from the current batch for this category
            var responsesForCategory = entities
                .Where(e => questionsWithCategories.FirstOrDefault(q => q.QuestionId == e.QuestionId)?.CategoryId == categoryId)
                .ToList();
            
            var score = await CalculateCategoryScoreAsync(categoryId, responsesForCategory);
            categoryScoreMap[categoryId] = score;
            Console.WriteLine($"[ResponseService] Pre-calculated category {categoryId} score: {score}");
        }

        // Process ToDoRules for each response with pre-calculated scores
        foreach (var entity in entities)
        {
            var questionCategory = questionsWithCategories.FirstOrDefault(q => q.QuestionId == entity.QuestionId);
            
            // Get pre-calculated category score if available
            int? categoryScore = null;
            if (questionCategory?.CategoryId.HasValue == true && categoryScoreMap.TryGetValue(questionCategory.CategoryId.Value, out var score))
            {
                categoryScore = score;
                Console.WriteLine($"[ResponseService] Using pre-calculated score {categoryScore} for question {entity.QuestionId} (category {questionCategory.CategoryId})");
            }
                
            await _toDoRuleService.ProcessResponseWithScoreAsync(entity, categoryScore);
        }
        

        return entities.Select(r => new ResponseDto
        {
            AnsweredQueryId = r.AnsweredQueryId,
            PatientId = r.PatientId,
            QuestionId = r.QuestionId,
            SelectedOptionId = r.SelectedOptionId,
            TextValue = r.TextValue,
            NumberValue = r.NumberValue,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<IEnumerable<AnsweredQueryHistoryDto>> GetHistoryForPatientAsync(int patientId)
    {
        var queries = await _db.AnsweredQueries
            .AsNoTracking()
            .Where(aq => aq.PatientId == patientId)
            .OrderByDescending(aq => aq.CreatedAt)
            .Include(aq => aq.Responses)
                .ThenInclude(r => r.Question)
                    .ThenInclude(q => q.QueryQuestions)
            .Include(aq => aq.Responses)
                .ThenInclude(r => r.SelectedOption)
            .ToListAsync();

        return queries.Select(aq => new AnsweredQueryHistoryDto
        {
            Id = aq.Id,
            CreatedAt = DateTime.SpecifyKind(aq.CreatedAt, DateTimeKind.Utc),
            Responses = aq.Responses
                .OrderBy(r => r.Question.QueryQuestions.FirstOrDefault()?.DisplayOrder ?? r.QuestionId)
                .Select(r => new ResponseHistoryItemDto
                {
                    QuestionId = r.QuestionId,
                    QuestionText = r.Question.FallbackText,
                    AnswerText = r.SelectedOption?.FallbackText ?? r.TextValue,
                    NumberValue = r.NumberValue,
                }).ToList()
        });
    }

    /// <summary>
    /// Calculates the cumulative score for a category based on responses from the current batch and Severity rules.
    /// Matches responses against Severity rules for questions in the category and sums matching scores.
    /// Only considers responses from the current submission, not historical responses.
    /// </summary>
    private async Task<int> CalculateCategoryScoreAsync(int categoryId, List<Response> currentBatchResponses)
    {
        // Get all questions in this category with their Severity rules
        var questions = await _db.Questions
            .AsNoTracking()
            .Where(q => q.CategoryId == categoryId)
            .Include(q => q.Severities)
            .ToListAsync();

        if (questions.Count == 0)
        {
            Console.WriteLine($"[CalculateCategoryScoreAsync] Category {categoryId}: No questions found");
            return 0;
        }

        var questionIds = questions.Select(q => q.QuestionId).ToList();
        
        // Build a map of current batch responses by question ID
        var responseMap = currentBatchResponses
            .Where(r => questionIds.Contains(r.QuestionId))
            .GroupBy(r => r.QuestionId)
            .ToDictionary(g => g.Key, g => g.Last()); // Last in case multiple responses for same question

        var totalScore = 0;
        Console.WriteLine($"[CalculateCategoryScoreAsync] Category {categoryId} (current batch only):");

        foreach (var question in questions)
        {
            if (!responseMap.TryGetValue(question.QuestionId, out var response))
            {
                Console.WriteLine($"  - Question {question.QuestionId}: No response in current batch");
                continue;
            }

            foreach (var severity in question.Severities)
            {
                if (!MatchesSeverityRule(severity.RequiredOption, severity.RequiredText, severity.RequiredValue, severity.Operator, response))
                {
                    continue;
                }

                totalScore += severity.Score;
                Console.WriteLine($"  - Question {question.QuestionId}: Matched severity rule, +{severity.Score} (total: {totalScore})");
            }
        }

        Console.WriteLine($"  - Final score: {totalScore}");
        return totalScore;
    }

    private static bool MatchesSeverityRule(int? requiredOption, string? requiredText, decimal? requiredValue, string? op, Response response)
    {
        if (requiredOption.HasValue && response.SelectedOptionId != requiredOption)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(requiredText))
        {
            if (string.IsNullOrWhiteSpace(response.TextValue))
            {
                return false;
            }

            if (!EvaluateText(response.TextValue, requiredText, op))
            {
                return false;
            }
        }

        if (requiredValue.HasValue)
        {
            if (!response.NumberValue.HasValue)
            {
                return false;
            }

            if (!EvaluateNumber(response.NumberValue.Value, requiredValue.Value, op))
            {
                return false;
            }
        }

        return true;
    }

    private static bool EvaluateNumber(decimal actual, decimal expected, string? op)
    {
        var operand = string.IsNullOrWhiteSpace(op) ? "==" : op.Trim().ToLowerInvariant();
        return operand switch
        {
            ">" or "gt" => actual > expected,
            ">=" or "gte" => actual >= expected,
            "<" or "lt" => actual < expected,
            "<=" or "lte" => actual <= expected,
            "!=" or "<>" or "neq" => actual != expected,
            _ => actual == expected
        };
    }

    private static bool EvaluateText(string actual, string expected, string? op)
    {
        var operand = string.IsNullOrWhiteSpace(op) ? "==" : op.Trim().ToLowerInvariant();
        return operand switch
        {
            "contains" => actual.Contains(expected, StringComparison.OrdinalIgnoreCase),
            "startswith" => actual.StartsWith(expected, StringComparison.OrdinalIgnoreCase),
            "endswith" => actual.EndsWith(expected, StringComparison.OrdinalIgnoreCase),
            "!=" or "<>" or "neq" => !actual.Equals(expected, StringComparison.OrdinalIgnoreCase),
            _ => actual.Equals(expected, StringComparison.OrdinalIgnoreCase)
        };
    }
}
