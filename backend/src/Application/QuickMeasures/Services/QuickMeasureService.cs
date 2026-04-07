using backend.src.Application.QuickMeasures.DTOs;
using backend.src.Application.QuickMeasures.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.QuickMeasures.Services;

public class QuickMeasureService : IQuickMeasureService
{
    private readonly AppDbContext _db;

    public QuickMeasureService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<QuickMeasureDto>> GetAllAsync()
    {
        var items = await _db.QuickMeasures.AsNoTracking().ToListAsync();
        return items.Select(ToDto);
    }

    public async Task<QuickMeasureDto> CreateAsync(CreateQuickMeasureDto dto)
    {
        var entity = new QuickMeasure
        {
            QuestionId = dto.QuestionId,
            CategoryId = dto.CategoryId,
            ScoreThreshold = dto.ScoreThreshold,
            IsExclusive = dto.IsExclusive,
            Priority = dto.Priority,
            TriggerType = dto.TriggerType,
            RequiredOption = dto.RequiredOption,
            RequiredText = dto.RequiredText,
            RequiredValue = dto.RequiredValue,
            Operator = dto.Operator,
            FallbackText = dto.FallbackText,
            Title = dto.Title,
            ResourceUrl = dto.ResourceUrl
        };
        _db.QuickMeasures.Add(entity);
        await _db.SaveChangesAsync();
        return ToDto(entity);
    }

    public async Task<IReadOnlyCollection<QuickMeasureResultDto>> EvaluateAsync(EvaluateQuickMeasuresDto dto)
    {
        // Fetch all question IDs in this query
        var questionIds = await _db.QueryQuestions
            .AsNoTracking()
            .Where(qq => qq.QueryId == dto.QueryId)
            .Select(qq => qq.QuestionId)
            .ToListAsync();

        if (questionIds.Count == 0)
            return Array.Empty<QuickMeasureResultDto>();

        // Fetch questions (with severities for category scoring)
        var questions = await _db.Questions
            .AsNoTracking()
            .Where(q => questionIds.Contains(q.QuestionId))
            .Include(q => q.Severities)
            .ToListAsync();

        // Fetch latest response per question for this patient (a patient may have answered the same question multiple times)
        var responses = (await _db.Responses
                .AsNoTracking()
                .Where(r => r.PatientId == dto.PatientId && questionIds.Contains(r.QuestionId))
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync())
            .GroupBy(r => r.QuestionId)
            .ToDictionary(g => g.Key, g => g.First());

        // Calculate category scores using Severities
        var categoryScores = CalculateCategoryScores(questions, responses);

        // Fetch all QuickMeasures linked to questions or categories in this query
        var categoryIds = questions
            .Where(q => q.CategoryId.HasValue)
            .Select(q => q.CategoryId!.Value)
            .Distinct()
            .ToList();

        var questionMeasures = await _db.QuickMeasures
            .AsNoTracking()
            .Where(m => m.TriggerType == MeasureTriggerType.Question
                        && m.QuestionId.HasValue
                        && questionIds.Contains(m.QuestionId.Value))
            .ToListAsync();

        var categoryMeasures = await _db.QuickMeasures
            .AsNoTracking()
            .Where(m => m.TriggerType == MeasureTriggerType.Category
                        && m.CategoryId.HasValue
                        && categoryIds.Contains(m.CategoryId.Value))
            .ToListAsync();

        var results = new List<QuickMeasureResultDto>();

        // Evaluate question-triggered measures
        foreach (var group in questionMeasures.GroupBy(m => m.QuestionId!.Value))
        {
            if (!responses.TryGetValue(group.Key, out var response) || response == null)
                continue;

            foreach (var measure in group.OrderByDescending(m => m.Priority))
            {
                if (!MatchesRule(measure.RequiredOption, measure.RequiredText, measure.RequiredValue, measure.Operator, response))
                    continue;

                results.Add(ToResultDto(measure));
            }
        }

        // Evaluate category score-triggered measures
        // Only show tiltak at the HIGHEST matching threshold (e.g. medium risk, not also low risk)
        foreach (var group in categoryMeasures.GroupBy(m => m.CategoryId!.Value))
        {
            var categoryScore = categoryScores.GetValueOrDefault(group.Key);

            var maxApplicableThreshold = group
                .Where(m => categoryScore >= m.ScoreThreshold)
                .Select(m => m.ScoreThreshold)
                .DefaultIfEmpty(-1)
                .Max();

            if (maxApplicableThreshold < 0)
                continue;

            foreach (var measure in group
                .Where(m => m.ScoreThreshold == maxApplicableThreshold)
                .OrderByDescending(m => m.Priority))
            {
                results.Add(ToResultDto(measure));
            }
        }

        return results
            .OrderByDescending(r => r.Priority)
            .ToList()
            .AsReadOnly();
    }

    private static Dictionary<int, int> CalculateCategoryScores(
        IEnumerable<Question> questions,
        IReadOnlyDictionary<int, Response> responses)
    {
        var scores = new Dictionary<int, int>();

        foreach (var question in questions)
        {
            if (!question.CategoryId.HasValue)
                continue;

            if (!responses.TryGetValue(question.QuestionId, out var response) || response == null)
                continue;

            foreach (var severity in question.Severities)
            {
                if (!MatchesRule(severity.RequiredOption, severity.RequiredText, severity.RequiredValue, severity.Operator, response))
                    continue;

                var catId = question.CategoryId.Value;
                scores[catId] = scores.TryGetValue(catId, out var current)
                    ? current + severity.Score
                    : severity.Score;
            }
        }

        return scores;
    }

    private static bool MatchesRule(
        int? requiredOption,
        string? requiredText,
        decimal? requiredValue,
        string? op,
        Response response)
    {
        if (requiredOption.HasValue && response.SelectedOptionId != requiredOption)
            return false;

        if (!string.IsNullOrWhiteSpace(requiredText))
        {
            if (string.IsNullOrWhiteSpace(response.TextValue))
                return false;

            if (!EvaluateText(response.TextValue, requiredText, op))
                return false;
        }

        if (requiredValue.HasValue)
        {
            if (!response.NumberValue.HasValue)
                return false;

            if (!EvaluateNumber(response.NumberValue.Value, requiredValue.Value, op))
                return false;
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
        var operand = string.IsNullOrWhiteSpace(op) ? "eq" : op.Trim().ToLowerInvariant();
        actual = actual.Trim();
        expected = expected.Trim();
        return operand switch
        {
            "contains" => actual.Contains(expected, StringComparison.OrdinalIgnoreCase),
            "not_contains" => !actual.Contains(expected, StringComparison.OrdinalIgnoreCase),
            "starts_with" => actual.StartsWith(expected, StringComparison.OrdinalIgnoreCase),
            "ends_with" => actual.EndsWith(expected, StringComparison.OrdinalIgnoreCase),
            "neq" or "!=" or "<>" => !actual.Equals(expected, StringComparison.OrdinalIgnoreCase),
            _ => actual.Equals(expected, StringComparison.OrdinalIgnoreCase)
        };
    }

    private static QuickMeasureDto ToDto(QuickMeasure m) => new()
    {
        QuickMeasureId = m.QuickMeasureId,
        QuestionId = m.QuestionId,
        CategoryId = m.CategoryId,
        ScoreThreshold = m.ScoreThreshold,
        IsExclusive = m.IsExclusive,
        Priority = m.Priority,
        TriggerType = m.TriggerType,
        RequiredOption = m.RequiredOption,
        RequiredText = m.RequiredText,
        RequiredValue = m.RequiredValue,
        Operator = m.Operator,
        FallbackText = m.FallbackText,
        Title = m.Title,
        ResourceUrl = m.ResourceUrl
    };

    private static QuickMeasureResultDto ToResultDto(QuickMeasure m) => new()
    {
        QuickMeasureId = m.QuickMeasureId,
        FallbackText = m.FallbackText,
        Title = m.Title,
        ResourceUrl = m.ResourceUrl,
        Priority = m.Priority
    };
}
