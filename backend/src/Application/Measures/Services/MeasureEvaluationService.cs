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
    private readonly SleepEvaluationService _sleepEvaluationService;
    private readonly KroppsDataEvaluationService _kroppsDataEvaluationService;
    private readonly BlodlipiderEvaluationService _blodlipiderEvaluationService;
    private readonly BlodtrykkEvaluationService _blodtrykkEvaluationService;
    private readonly GlukoseEvaluationService _glukoseEvaluationService;

    private const int SleepCategoryId = 10;
    private const int KroppsDataCategoryId = 9;

    public MeasureEvaluationService(AppDbContext db)
    {
        _db = db;
        _sleepEvaluationService = new SleepEvaluationService();
        _kroppsDataEvaluationService = new KroppsDataEvaluationService(db);
        _blodlipiderEvaluationService = new BlodlipiderEvaluationService(db);
        _blodtrykkEvaluationService = new BlodtrykkEvaluationService(db);
        _glukoseEvaluationService = new GlukoseEvaluationService(db);
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

        var dependencies = await _db.QuestionDependencies
            .AsNoTracking()
            .Where(d => d.ParentQueryId == dto.QueryId && d.ChildQueryId == dto.QueryId)
            .ToListAsync();

        // Categories the patient has actually answered at least one question in.
        var answeredCategoryIds = questions
            .Where(q => q.CategoryId.HasValue && responses.ContainsKey(q.QuestionId))
            .Select(q => q.CategoryId!.Value)
            .ToHashSet();

        var categoryScores = CalculateCategoryScores(questions, responses, answeredCategoryIds, dependencies);

        // Remember which categories came from questions (before measurement scoring adds more)
        var questionDerivedCategoryIds = new HashSet<int>(categoryIds);

        await ApplyMeasurementSeveritiesAsync(dto.PatientId, categoryScores, answeredCategoryIds);

        var blodlipiderResult = await _blodlipiderEvaluationService.EvaluateAsync(dto.PatientId, responses);
        if (blodlipiderResult is not null)
        {
            answeredCategoryIds.Add(blodlipiderResult.CategoryId);
            var updatedLipidsScore = Math.Max(categoryScores.GetValueOrDefault(blodlipiderResult.CategoryId), blodlipiderResult.Score);
            categoryScores[blodlipiderResult.CategoryId] = updatedLipidsScore;
        }

        var blodtrykkResult = await _blodtrykkEvaluationService.EvaluateAsync(dto.PatientId);
        if (blodtrykkResult is not null)
        {
            answeredCategoryIds.Add(blodtrykkResult.CategoryId);
            var updatedBpScore = Math.Max(categoryScores.GetValueOrDefault(blodtrykkResult.CategoryId), blodtrykkResult.Score);
            categoryScores[blodtrykkResult.CategoryId] = updatedBpScore;
        }

        var glukoseResult = await _glukoseEvaluationService.EvaluateAsync(dto.PatientId);
        if (glukoseResult is not null)
        {
            answeredCategoryIds.Add(glukoseResult.CategoryId);
            var updatedGlukoseScore = Math.Max(categoryScores.GetValueOrDefault(glukoseResult.CategoryId), glukoseResult.Score);
            categoryScores[glukoseResult.CategoryId] = updatedGlukoseScore;
        }

        var kroppsDataResult = await _kroppsDataEvaluationService.EvaluateAsync(dto.PatientId, responses);
        if (kroppsDataResult is not null)
        {
            answeredCategoryIds.Add(KroppsDataCategoryId);
            var updatedScore = Math.Max(categoryScores.GetValueOrDefault(KroppsDataCategoryId), kroppsDataResult.Score);
            categoryScores[KroppsDataCategoryId] = updatedScore;
        }
        var languageCode = NormalizeLanguage(dto.LanguageCode);
        var generatedAt = DateTime.UtcNow;

        var patientResults = new List<PatientMeasureResultDto>();
        var personnelResults = new List<PersonnelMeasureResultDto>();

        EvaluateQuestionMeasures(patientQuestionMeasures, responses, categoryScores, languageCode, generatedAt, patientResults);
        EvaluateQuestionMeasures(personnelQuestionMeasures, responses, categoryScores, languageCode, generatedAt, personnelResults);

        EvaluateCategoryMeasures(patientCategoryMeasures, categoryScores, answeredCategoryIds, languageCode, generatedAt, patientResults);
        EvaluateCategoryMeasures(personnelCategoryMeasures, categoryScores, answeredCategoryIds, languageCode, generatedAt, personnelResults);

        // Custom evaluations for categories with specialized scoring logic
        if (answeredCategoryIds.Contains(SleepCategoryId))
        {
            var sleepTitles = _sleepEvaluationService.EvaluatePatientTitles(questions, responses);
            var sleepPatientMeasures = await _db.PatientMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == SleepCategoryId
                         && m.Title != null
                         && sleepTitles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in sleepPatientMeasures)
            {
                patientResults.Add(new PatientMeasureResultDto
                {
                    PatientMeasureId = measure.PatientMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = categoryScores.GetValueOrDefault(SleepCategoryId),
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

        if (kroppsDataResult is not null)
        {
            var updatedScore = categoryScores.GetValueOrDefault(KroppsDataCategoryId);

            var kroppsDataPatientMeasures = await _db.PatientMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == KroppsDataCategoryId
                         && m.Title != null
                         && kroppsDataResult.Titles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in kroppsDataPatientMeasures)
            {
                patientResults.Add(new PatientMeasureResultDto
                {
                    PatientMeasureId = measure.PatientMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = updatedScore,
                    Text = ResolvePatientText(measure, languageCode),
                    Title = ResolvePatientTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });
            }

            var kroppsDataPersonnelMeasures = await _db.PersonnelMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == KroppsDataCategoryId
                         && m.Title != null
                         && kroppsDataResult.Titles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in kroppsDataPersonnelMeasures)
            {
                personnelResults.Add(new PersonnelMeasureResultDto
                {
                    PersonnelMeasureId = measure.PersonnelMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = updatedScore,
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

        if (blodlipiderResult is not null)
        {
            var updatedScore = categoryScores.GetValueOrDefault(blodlipiderResult.CategoryId);

            var lipidPatientMeasures = await _db.PatientMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == blodlipiderResult.CategoryId
                         && m.Title != null
                         && blodlipiderResult.Titles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in lipidPatientMeasures)
            {
                patientResults.Add(new PatientMeasureResultDto
                {
                    PatientMeasureId = measure.PatientMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = updatedScore,
                    Text = ResolvePatientText(measure, languageCode),
                    Title = ResolvePatientTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });
            }

            var lipidPersonnelMeasures = await _db.PersonnelMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == blodlipiderResult.CategoryId
                         && m.Title != null
                         && blodlipiderResult.Titles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in lipidPersonnelMeasures)
            {
                personnelResults.Add(new PersonnelMeasureResultDto
                {
                    PersonnelMeasureId = measure.PersonnelMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = updatedScore,
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

        if (blodtrykkResult is not null)
        {
            var updatedScore = categoryScores.GetValueOrDefault(blodtrykkResult.CategoryId);

            var bpPatientMeasures = await _db.PatientMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == blodtrykkResult.CategoryId
                         && m.Title != null
                         && blodtrykkResult.Titles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in bpPatientMeasures)
            {
                patientResults.Add(new PatientMeasureResultDto
                {
                    PatientMeasureId = measure.PatientMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = updatedScore,
                    Text = ResolvePatientText(measure, languageCode),
                    Title = ResolvePatientTitle(measure, languageCode),
                    ResourceUrl = measure.ResourceUrl,
                    GeneratedAt = generatedAt,
                    ScoreThreshold = measure.ScoreThreshold,
                    IsExclusive = measure.IsExclusive,
                    Priority = measure.Priority
                });
            }

            var bpPersonnelMeasures = await _db.PersonnelMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Custom
                         && m.CategoryId == blodtrykkResult.CategoryId
                         && m.Title != null
                         && blodtrykkResult.Titles.Contains(m.Title))
                .ToListAsync();

            foreach (var measure in bpPersonnelMeasures)
            {
                personnelResults.Add(new PersonnelMeasureResultDto
                {
                    PersonnelMeasureId = measure.PersonnelMeasureId,
                    Source = MeasureResultSource.CategoryScore,
                    CategoryId = measure.CategoryId,
                    TriggerQuestionId = null,
                    CategoryScore = updatedScore,
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

        // Fetch and evaluate Category-trigger PatientMeasures for categories that were added
        // purely by measurement scoring (e.g. glukose/HbA1C entered by clinician) and therefore
        // were not included in the initial patientCategoryMeasures query.
        var measurementOnlyCategoryIds = answeredCategoryIds
            .Except(questionDerivedCategoryIds)
            .ToList();

        if (measurementOnlyCategoryIds.Count > 0)
        {
            var extraPatientCategoryMeasures = await _db.PatientMeasures
                .AsNoTracking()
                .Include(m => m.Texts)
                .Where(m => m.TriggerType == MeasureTriggerType.Category
                         && m.CategoryId.HasValue
                         && measurementOnlyCategoryIds.Contains(m.CategoryId.Value))
                .ToListAsync();

            EvaluateCategoryMeasures(extraPatientCategoryMeasures, categoryScores, answeredCategoryIds, languageCode, generatedAt, patientResults);
        }

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
        IReadOnlySet<int> answeredCategoryIds,
        IReadOnlyList<QuestionDependency> dependencies)
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

            // Skip scoring for questions that are hidden by unmet dependencies.
            // This prevents old fallback responses from inflating the score when
            // a conditional question was not shown in the most recent submission.
            if (!IsQuestionVisible(question.QuestionId, dependencies, responses))
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

    private static bool IsQuestionVisible(
        int questionId,
        IReadOnlyList<QuestionDependency> dependencies,
        IReadOnlyDictionary<int, Response> responses)
    {
        var questionDeps = dependencies.Where(d => d.ChildQuestionId == questionId).ToList();
        if (questionDeps.Count == 0) return true;

        // Group by parent question. All parent groups must be satisfied (AND across parents).
        // Within a parent group, at least one condition must match (OR within group).
        foreach (var group in questionDeps.GroupBy(d => d.ParentQuestionId))
        {
            if (!responses.TryGetValue(group.Key, out var parentResponse) || parentResponse == null)
                return false;

            bool anyMatch = group.Any(dep =>
                MatchesRule(dep.TriggerOptionId, dep.TriggerTextValue, dep.TriggerNumberValue, dep.Operator, parentResponse));

            if (!anyMatch) return false;
        }

        return true;
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
                .OrderByDescending(m => m.Priority)
                .ThenByDescending(m => m.ScoreThreshold))
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
                .OrderByDescending(m => m.Priority)
                .ThenByDescending(m => m.ScoreThreshold))
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

    private async Task ApplyMeasurementSeveritiesAsync(
        int patientId,
        Dictionary<int, int> categoryScores,
        HashSet<int> answeredCategoryIds)
    {
        var measurementSeverities = await _db.Severities
            .AsNoTracking()
            .Where(s => s.MeasurementId.HasValue)
            .Join(
                _db.Measurements.AsNoTracking().Where(m => m.CategoryId.HasValue),
                severity => severity.MeasurementId!.Value,
                measurement => measurement.MeasurementId,
                (severity, measurement) => new MeasurementSeverityInfo(
                    severity.MeasurementId!.Value,
                    measurement.CategoryId!.Value,
                    severity.RequiredValue,
                    severity.Operator,
                    severity.Score))
            .ToListAsync();

        if (measurementSeverities.Count == 0)
        {
            return;
        }

        var measurementIds = measurementSeverities
            .Select(s => s.MeasurementId)
            .Distinct()
            .ToList();

        var latestMeasurements = await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId && measurementIds.Contains(r.MeasurementId))
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        var latestByMeasurement = latestMeasurements
            .GroupBy(r => r.MeasurementId)
            .ToDictionary(
                g => g.Key,
                g => g.First().Result);

        if (latestByMeasurement.Count == 0)
        {
            return;
        }

        foreach (var severity in measurementSeverities)
        {
            if (!latestByMeasurement.TryGetValue(severity.MeasurementId, out var actualValue))
            {
                continue;
            }

            if (severity.RequiredValue.HasValue &&
                !EvaluateNumber(actualValue, severity.RequiredValue.Value, severity.Operator))
            {
                continue;
            }

            var categoryId = severity.CategoryId;
            answeredCategoryIds.Add(categoryId);
            var current = categoryScores.GetValueOrDefault(categoryId);
            categoryScores[categoryId] = current + severity.Score;
        }
    }

    private sealed record MeasurementSeverityInfo(
        int MeasurementId,
        int CategoryId,
        decimal? RequiredValue,
        string? Operator,
        int Score);

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
