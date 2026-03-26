using System.Linq;
using backend.src.Application.Measures.DTOs;
using backend.src.Application.Measures.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

public class MeasureEvaluationService : IMeasureEvaluationService
{
    private readonly AppDbContext _db;

    public MeasureEvaluationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<MeasureEvaluationResultDto> EvaluateAsync(EvaluateMeasuresDto dto)
    {
        var questionIds = await _db.QueryQuestions
            .AsNoTracking()
            .Where(qq => qq.QueryId == dto.QueryId)
            .Select(qq => qq.QuestionId)
            .ToListAsync();

        if (questionIds.Count == 0)
        {
            throw new InvalidOperationException($"Query {dto.QueryId} does not contain any questions.");
        }

        var questions = await _db.Questions
            .AsNoTracking()
            .Where(q => questionIds.Contains(q.QuestionId))
            .Include(q => q.Severities)
            .ToListAsync();

        // Fetch answered queries for this patient, newest first, to support fallback logic:
        // if the latest answered query is missing responses for some questions, we fall back
        // to the most recent earlier query that does have an answer for each question.
        var answeredQueryOrder = await _db.AnsweredQueries
            .AsNoTracking()
            .Where(aq => aq.PatientId == dto.PatientId)
            .OrderByDescending(aq => aq.CreatedAt)
            .Select(aq => aq.Id)
            .ToListAsync();

        var allResponses = await _db.Responses
            .AsNoTracking()
            .Where(r => r.PatientId == dto.PatientId && questionIds.Contains(r.QuestionId))
            .ToListAsync();

        var orderLookup = answeredQueryOrder
            .Select((id, index) => (id, index))
            .ToDictionary(x => x.id, x => x.index);

        // For each question, pick the response from the most recent answered query.
        var responses = allResponses
            .GroupBy(r => r.QuestionId)
            .ToDictionary(
                g => g.Key,
                g => g.OrderBy(r => orderLookup.GetValueOrDefault(r.AnsweredQueryId, int.MaxValue))
                       .First()
            );

        var patientQuestionMeasures = await _db.PatientMeasures
            .AsNoTracking()
            .Include(m => m.Texts)
            .Where(m => m.TriggerType == MeasureTriggerType.Question && m.QuestionId.HasValue && questionIds.Contains(m.QuestionId.Value))
            .ToListAsync();

        var personnelQuestionMeasures = await _db.PersonnelMeasures
            .AsNoTracking()
            .Include(m => m.Texts)
            .Where(m => m.TriggerType == MeasureTriggerType.Question && m.QuestionId.HasValue && questionIds.Contains(m.QuestionId.Value))
            .ToListAsync();

        var categoryIds = questions
            .Where(q => q.CategoryId.HasValue)
            .Select(q => q.CategoryId!.Value)
            .Distinct()
            .ToList();

        var patientCategoryMeasures = await _db.PatientMeasures
            .AsNoTracking()
            .Include(m => m.Texts)
            .Where(m => m.TriggerType == MeasureTriggerType.Category && m.CategoryId.HasValue && categoryIds.Contains(m.CategoryId.Value))
            .ToListAsync();

        var personnelCategoryMeasures = await _db.PersonnelMeasures
            .AsNoTracking()
            .Include(m => m.Texts)
            .Where(m => m.TriggerType == MeasureTriggerType.Category && m.CategoryId.HasValue && categoryIds.Contains(m.CategoryId.Value))
            .ToListAsync();

        // Categories the patient has actually answered at least one question in.
        var answeredCategoryIds = questions
            .Where(q => q.CategoryId.HasValue && responses.ContainsKey(q.QuestionId))
            .Select(q => q.CategoryId!.Value)
            .ToHashSet();

        var categoryScores = CalculateCategoryScores(questions, responses, answeredCategoryIds);
        var languageCode = NormalizeLanguage(dto.LanguageCode);
        var generatedAt = DateTime.UtcNow;

        var patientResults = new List<PatientMeasureResultDto>();
        var personnelResults = new List<PersonnelMeasureResultDto>();

        EvaluateQuestionMeasures(patientQuestionMeasures, responses, categoryScores, languageCode, generatedAt, patientResults);
        EvaluateQuestionMeasures(personnelQuestionMeasures, responses, categoryScores, languageCode, generatedAt, personnelResults);

        EvaluateCategoryMeasures(patientCategoryMeasures, categoryScores, answeredCategoryIds, languageCode, generatedAt, patientResults);
        EvaluateCategoryMeasures(personnelCategoryMeasures, categoryScores, answeredCategoryIds, languageCode, generatedAt, personnelResults);

        return new MeasureEvaluationResultDto
        {
            PatientMeasures = patientResults,
            PersonnelMeasures = personnelResults,
            CategoryScores = categoryScores
        };
    }

    private static Dictionary<int, int> CalculateCategoryScores(
        IEnumerable<Question> questions,
        IReadOnlyDictionary<int, Response> responses,
        IReadOnlySet<int> answeredCategoryIds)
    {
        // Seed all answered categories with 0 so the frontend always gets a score
        // for every category the patient has actually responded to.
        var categoryScores = answeredCategoryIds.ToDictionary(id => id, _ => 0);

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

                var categoryId = question.CategoryId.Value;
                categoryScores[categoryId] = categoryScores.GetValueOrDefault(categoryId) + severity.Score;
            }
        }

        return categoryScores;
    }

    private static void EvaluateQuestionMeasures(
        IEnumerable<PatientMeasure> measures,
        IReadOnlyDictionary<int, Response> responses,
        IReadOnlyDictionary<int, int> categoryScores,
        string? languageCode,
        DateTime generatedAt,
        ICollection<PatientMeasureResultDto> results)
    {
        var grouped = measures.GroupBy(m => m.QuestionId!.Value);

        foreach (var group in grouped)
        {
            if (!responses.TryGetValue(group.Key, out var response) || response == null)
            {
                continue;
            }

            foreach (var measure in group.OrderByDescending(m => m.Priority))
            {
                if (!MatchesRule(measure.RequiredOption, measure.RequiredText, measure.RequiredValue, measure.Operator, response))
                {
                    continue;
                }

                var categoryId = measure.CategoryId;
                var categoryScore = categoryId.HasValue ? categoryScores.GetValueOrDefault(categoryId.Value) : 0;

                results.Add(new PatientMeasureResultDto
                {
                    PatientMeasureId = measure.PatientMeasureId,
                    Source = MeasureResultSource.QuestionTrigger,
                    CategoryId = categoryId,
                    TriggerQuestionId = group.Key,
                    CategoryScore = categoryScore,
                    Text = ResolvePatientText(measure, languageCode),
                    Title = ResolvePatientTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });
            }
        }
    }

    private static void EvaluateQuestionMeasures(
        IEnumerable<PersonnelMeasure> measures,
        IReadOnlyDictionary<int, Response> responses,
        IReadOnlyDictionary<int, int> categoryScores,
        string? languageCode,
        DateTime generatedAt,
        ICollection<PersonnelMeasureResultDto> results)
    {
        var grouped = measures.GroupBy(m => m.QuestionId!.Value);

        foreach (var group in grouped)
        {
            if (!responses.TryGetValue(group.Key, out var response) || response == null)
            {
                continue;
            }

            foreach (var measure in group.OrderByDescending(m => m.Priority))
            {
                if (!MatchesRule(measure.RequiredOption, measure.RequiredText, measure.RequiredValue, measure.Operator, response))
                {
                    continue;
                }

                var categoryId = measure.CategoryId;
                var categoryScore = categoryId.HasValue ? categoryScores.GetValueOrDefault(categoryId.Value) : 0;

                results.Add(new PersonnelMeasureResultDto
                {
                    PersonnelMeasureId = measure.PersonnelMeasureId,
                    Source = MeasureResultSource.QuestionTrigger,
                    CategoryId = categoryId,
                    TriggerQuestionId = group.Key,
                    CategoryScore = categoryScore,
                    Text = ResolvePersonnelText(measure, languageCode),
                    Title = ResolvePersonnelTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });
            }
        }
    }

    private static void EvaluateCategoryMeasures(
        IEnumerable<PatientMeasure> measures,
        IReadOnlyDictionary<int, int> categoryScores,
        IReadOnlySet<int> answeredCategoryIds,
        string? languageCode,
        DateTime generatedAt,
        ICollection<PatientMeasureResultDto> results)
    {
        var grouped = measures.GroupBy(m => m.CategoryId!.Value);

        foreach (var group in grouped)
        {
            if (!answeredCategoryIds.Contains(group.Key))
                continue;

            var categoryScore = categoryScores.GetValueOrDefault(group.Key);

            foreach (var measure in group
                .OrderByDescending(m => m.ScoreThreshold)
                .ThenByDescending(m => m.Priority))
            {
                if (categoryScore < measure.ScoreThreshold)
                {
                    continue;
                }

                results.Add(new PatientMeasureResultDto
                {
                    PatientMeasureId = measure.PatientMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = categoryScore,
                    Text = ResolvePatientText(measure, languageCode),
                    Title = ResolvePatientTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });

                if (measure.IsExclusive)
                {
                    break;
                }
            }
        }
    }

    private static void EvaluateCategoryMeasures(
        IEnumerable<PersonnelMeasure> measures,
        IReadOnlyDictionary<int, int> categoryScores,
        IReadOnlySet<int> answeredCategoryIds,
        string? languageCode,
        DateTime generatedAt,
        ICollection<PersonnelMeasureResultDto> results)
    {
        var grouped = measures.GroupBy(m => m.CategoryId!.Value);

        foreach (var group in grouped)
        {
            if (!answeredCategoryIds.Contains(group.Key))
                continue;

            var categoryScore = categoryScores.GetValueOrDefault(group.Key);

            foreach (var measure in group
                .OrderByDescending(m => m.ScoreThreshold)
                .ThenByDescending(m => m.Priority))
            {
                if (categoryScore < measure.ScoreThreshold)
                {
                    continue;
                }

                results.Add(new PersonnelMeasureResultDto
                {
                    PersonnelMeasureId = measure.PersonnelMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = categoryScore,
                    Text = ResolvePersonnelText(measure, languageCode),
                    Title = ResolvePersonnelTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });

                if (measure.IsExclusive)
                {
                    break;
                }
            }
        }
    }

    private async Task PersistResultsAsync(
        EvaluateMeasuresDto dto,
        DateTime generatedAt,
        IReadOnlyCollection<PatientMeasureResultDto> patientResults,
        IReadOnlyCollection<PersonnelMeasureResultDto> personnelResults)
    {
        await using var transaction = await _db.Database.BeginTransactionAsync();

        var existingPatient = await _db.PatientMeasureResults
            .Where(r => r.PatientId == dto.PatientId && r.QueryId == dto.QueryId)
            .ToListAsync();
        _db.PatientMeasureResults.RemoveRange(existingPatient);

        var existingPersonnel = await _db.PersonnelMeasureResults
            .Where(r => r.PatientId == dto.PatientId && r.QueryId == dto.QueryId)
            .ToListAsync();
        _db.PersonnelMeasureResults.RemoveRange(existingPersonnel);

        var patientEntities = patientResults.Select(r => new PatientMeasureResult
        {
            PatientMeasureId = r.PatientMeasureId,
            PatientId = dto.PatientId,
            QueryId = dto.QueryId,
            CategoryId = r.CategoryId,
            TriggerQuestionId = r.TriggerQuestionId,
            CategoryScore = r.CategoryScore,
            Source = r.Source,
            GeneratedAt = generatedAt
        });

        var personnelEntities = personnelResults.Select(r => new PersonnelMeasureResult
        {
            PersonnelMeasureId = r.PersonnelMeasureId,
            PatientId = dto.PatientId,
            QueryId = dto.QueryId,
            CategoryId = r.CategoryId,
            TriggerQuestionId = r.TriggerQuestionId,
            CategoryScore = r.CategoryScore,
            Source = r.Source,
            GeneratedAt = generatedAt,
            PersonnelId = dto.PersonnelId
        });

        _db.PatientMeasureResults.AddRange(patientEntities);
        _db.PersonnelMeasureResults.AddRange(personnelEntities);

        await _db.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    private static bool MatchesRule(int? requiredOption, string? requiredText, decimal? requiredValue, string? op, Response response)
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

    private static string ResolvePatientText(PatientMeasure measure, string? languageCode)
    {
        if (!string.IsNullOrWhiteSpace(languageCode))
        {
            var localized = measure.Texts.FirstOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));
            if (localized != null)
            {
                return localized.Text;
            }
        }

        return measure.FallbackText;
    }

    private static string? ResolvePatientTitle(PatientMeasure measure, string? languageCode)
    {
        if (!string.IsNullOrWhiteSpace(languageCode))
        {
            var localized = measure.Texts.FirstOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));
            if (localized != null && !string.IsNullOrWhiteSpace(localized.Title))
            {
                return localized.Title;
            }
        }

        return measure.Title;
    }

    private static string ResolvePersonnelText(PersonnelMeasure measure, string? languageCode)
    {
        if (!string.IsNullOrWhiteSpace(languageCode))
        {
            var localized = measure.Texts.FirstOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));
            if (localized != null)
            {
                return localized.Text;
            }
        }

        return measure.FallbackText;
    }

    private static string? ResolvePersonnelTitle(PersonnelMeasure measure, string? languageCode)
    {
        if (!string.IsNullOrWhiteSpace(languageCode))
        {
            var localized = measure.Texts.FirstOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));
            if (localized != null && !string.IsNullOrWhiteSpace(localized.Title))
            {
                return localized.Title;
            }
        }

        return measure.Title;
    }

    private static string? NormalizeLanguage(string? languageCode)
        => string.IsNullOrWhiteSpace(languageCode) ? null : languageCode.Trim();
}

