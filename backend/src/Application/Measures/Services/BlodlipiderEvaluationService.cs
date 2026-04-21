using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

public record BlodlipiderEvaluationResult(int CategoryId, int Score, IReadOnlyList<string> Titles);

public class BlodlipiderEvaluationService
{
    private readonly AppDbContext _db;

    private static class MeasureTitleKeys
    {
        public const string TotalCholesterolHigh = "Totalkolesterol >= 7,0";
        public const string TotalCholesterolNormal = "Totalkolesterol < 7,0";
        public const string TriglyceridesVeryHigh = "Triglyserider >= 10,0";
        public const string TriglyceridesElevated = "Triglyserider 4,0-9,9";
        public const string TriglyceridesLifestyle = "Triglyserider 1,7-3,9";
        public const string ComorbidityTreatment = "Lipidsenkende behandling (komorbiditet)";
        public const string CategoryHigh = "Blodlipider score 2";
        public const string CategoryMedium = "Blodlipider score 1";
        public const string CategoryLow = "Blodlipider score 0";
        public const string LdlOptimal = "LDL < 1,8";
        public const string LdlModerate = "LDL 1,8-2,9";
        public const string LdlElevated = "LDL 3,0-3,9";
        public const string LdlVeryHigh = "LDL > 4,9";
        public const string HdlLow = "HDL lav";
    }

    private const int TotalCholesterolMeasurementId = 6;
    private const int LdlMeasurementId = 7;
    private const int HdlMeasurementId = 8;
    private const int TriglyceridesMeasurementId = 9;

    private readonly int[] _measurementIds =
    [
        TotalCholesterolMeasurementId,
        LdlMeasurementId,
        HdlMeasurementId,
        TriglyceridesMeasurementId
    ];

    private int? _heartDiseaseQuestionId;
    private int? _diabetesQuestionId;
    private int? _fhQuestionId;
    private bool _questionLookupLoaded;

    public BlodlipiderEvaluationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BlodlipiderEvaluationResult?> EvaluateAsync(
        int patientId,
        IReadOnlyDictionary<int, Response> responses)
    {
        await EnsureQuestionLookupAsync();

        var measurementRows = await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId && _measurementIds.Contains(r.MeasurementId))
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        var latestMeasurements = measurementRows
            .GroupBy(r => r.MeasurementId)
            .ToDictionary(g => g.Key, g => (decimal?)g.First().Result);

        var measurementCategoryId = await _db.Measurements
            .AsNoTracking()
            .Where(m => _measurementIds.Contains(m.MeasurementId) && m.CategoryId.HasValue)
            .Select(m => m.CategoryId!.Value)
            .FirstOrDefaultAsync();

        if (measurementCategoryId == 0)
        {
            return null;
        }

        var totalCholesterol = latestMeasurements.GetValueOrDefault(TotalCholesterolMeasurementId);
        var ldl = latestMeasurements.GetValueOrDefault(LdlMeasurementId);
        var hdl = latestMeasurements.GetValueOrDefault(HdlMeasurementId);
        var trig = latestMeasurements.GetValueOrDefault(TriglyceridesMeasurementId);

        bool hasAtLeastOneMeasurement = totalCholesterol.HasValue || ldl.HasValue || hdl.HasValue || trig.HasValue;

        bool heartDisease = _heartDiseaseQuestionId.HasValue &&
            responses.TryGetValue(_heartDiseaseQuestionId.Value, out var heartResponse) &&
            IsAffirmative(heartResponse);

        bool diabetes = _diabetesQuestionId.HasValue &&
            responses.TryGetValue(_diabetesQuestionId.Value, out var diabetesResponse) &&
            IsAffirmative(diabetesResponse);

        bool fh = _fhQuestionId.HasValue &&
            responses.TryGetValue(_fhQuestionId.Value, out var fhResponse) &&
            IsAffirmative(fhResponse);

        if (!hasAtLeastOneMeasurement && !heartDisease && !diabetes && !fh)
        {
            return null;
        }

        bool highRisk = heartDisease || diabetes || fh;
        bool mediumRisk = false;

        var titles = new List<string>();
        var seenTitles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        void AddTitle(string? title)
        {
            if (string.IsNullOrWhiteSpace(title)) return;
            if (seenTitles.Add(title)) titles.Add(title);
        }

        if (totalCholesterol.HasValue)
        {
            if (totalCholesterol.Value >= 7m)
            {
                mediumRisk = true;
                AddTitle(MeasureTitleKeys.TotalCholesterolHigh);
            }
            else
            {
                AddTitle(MeasureTitleKeys.TotalCholesterolNormal);
            }
        }

        if (trig.HasValue)
        {
            if (trig.Value >= 10m)
            {
                highRisk = true;
                AddTitle(MeasureTitleKeys.TriglyceridesVeryHigh);
            }
            else if (trig.Value >= 4m)
            {
                mediumRisk = true;
                AddTitle(MeasureTitleKeys.TriglyceridesElevated);
            }
            else if (trig.Value >= 1.7m)
            {
                AddTitle(MeasureTitleKeys.TriglyceridesLifestyle);
            }
        }

        if (ldl.HasValue)
        {
            if (ldl.Value > 4.9m)
            {
                highRisk = true;
                AddTitle(MeasureTitleKeys.LdlVeryHigh);
            }
            else if (ldl.Value >= 3.0m)
            {
                mediumRisk = true;
                AddTitle(MeasureTitleKeys.LdlElevated);
            }
            else if (ldl.Value >= 1.8m)
            {
                AddTitle(MeasureTitleKeys.LdlModerate);
            }
            else
            {
                AddTitle(MeasureTitleKeys.LdlOptimal);
            }
        }

        if (hdl.HasValue)
        {
            var gender = await _db.Patients
                .AsNoTracking()
                .Where(p => p.Id == patientId)
                .Select(p => p.Gender)
                .FirstOrDefaultAsync() ?? "";

            bool hdlLow = gender.Equals("Mann", StringComparison.OrdinalIgnoreCase)
                ? hdl.Value < 1.0m
                : hdl.Value < 1.2m;

            if (hdlLow)
            {
                mediumRisk = true;
                AddTitle(MeasureTitleKeys.HdlLow);
            }
        }

        if (heartDisease || diabetes || fh)
        {
            AddTitle(MeasureTitleKeys.ComorbidityTreatment);
        }

        int finalScore = highRisk ? 2 : mediumRisk ? 1 : 0;

        // Alltid legg til kategori-score tittel slik at pasienten alltid
        // får de score-baserte tiltakene (score 0/1/2) vist.
        AddTitle(finalScore switch
        {
            2 => MeasureTitleKeys.CategoryHigh,
            1 => MeasureTitleKeys.CategoryMedium,
            _ => MeasureTitleKeys.CategoryLow
        });

        return new BlodlipiderEvaluationResult(measurementCategoryId, finalScore, titles);
    }

    private async Task EnsureQuestionLookupAsync()
    {
        if (_questionLookupLoaded) return;

        var questions = await _db.Questions
            .AsNoTracking()
            .Where(q => q.FallbackText != null &&
                        (q.FallbackText.ToLower().Contains("hjerte") ||
                         q.FallbackText.ToLower().Contains("karsykdom") ||
                         q.FallbackText.ToLower().Contains("diabetes") ||
                         q.FallbackText.ToLower().Contains("hyperkolesterol")))
            .Select(q => new { q.QuestionId, q.FallbackText })
            .ToListAsync();

        _heartDiseaseQuestionId = questions
            .FirstOrDefault(q => q.FallbackText != null &&
                                 (q.FallbackText.Contains("hjerte", StringComparison.OrdinalIgnoreCase) ||
                                  q.FallbackText.Contains("karsykdom", StringComparison.OrdinalIgnoreCase)))?.QuestionId;

        _diabetesQuestionId = questions
            .FirstOrDefault(q => q.FallbackText != null &&
                                 q.FallbackText.Contains("diabetes", StringComparison.OrdinalIgnoreCase))?.QuestionId;

        _fhQuestionId = questions
            .FirstOrDefault(q => q.FallbackText != null &&
                                 q.FallbackText.Contains("hyperkolesterol", StringComparison.OrdinalIgnoreCase))?.QuestionId;

        _questionLookupLoaded = true;
    }

    private static bool IsAffirmative(Response response)
    {
        if (!string.IsNullOrWhiteSpace(response.TextValue) &&
            response.TextValue.Trim().Equals("ja", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (response.NumberValue.HasValue && response.NumberValue.Value >= 1)
        {
            return true;
        }

        return false;
    }
}
