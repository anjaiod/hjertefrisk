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
        public const string TotalCholesterolHigh   = "Totalkolesterol >= 7,0";
        public const string TotalCholesterolNormal = "Totalkolesterol < 7,0";
        public const string TriglyceridesVeryHigh  = "Triglyserider >= 10,0";
        public const string TriglyceridesElevated  = "Triglyserider 4,0-9,9";
        public const string TriglyceridesLifestyle = "Triglyserider 1,7-3,9";
        public const string LdlVeryHigh            = "LDL > 4,9";
        public const string LdlElevated            = "LDL 3,0-4,9";
        public const string LdlModerate            = "LDL 1,8-2,9";
        public const string LdlOptimal             = "LDL < 1,8";
        public const string HdlLow                 = "HDL lav";
        public const string ComorbidityTreatment   = "Lipidsenkende behandling (komorbiditet)";
        public const string CategoryHigh           = "Blodlipider score 2";
        public const string CategoryMedium         = "Blodlipider score 1";
        public const string CategoryLow            = "Blodlipider score 0";
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

        var patient = await _db.Patients
            .AsNoTracking()
            .Where(p => p.Id == patientId)
            .Select(p => new { p.Gender })
            .FirstOrDefaultAsync();

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

        if (!hasAtLeastOneMeasurement && !heartDisease && !diabetes)
        {
            return null;
        }

        bool highRisk = heartDisease || diabetes;
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
            else if (ldl.Value >= 3m)
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
            var gender = patient?.Gender ?? "";
            bool lowHdl = gender.Equals("Mann", StringComparison.OrdinalIgnoreCase)
                ? hdl.Value < 1.0m
                : hdl.Value < 1.2m;

            if (lowHdl)
            {
                mediumRisk = true;
                AddTitle(MeasureTitleKeys.HdlLow);
            }
        }

        if (heartDisease || diabetes)
        {
            AddTitle(MeasureTitleKeys.ComorbidityTreatment);
        }

        int finalScore = highRisk ? 2 : mediumRisk ? 1 : 0;

        if (titles.Count == 0)
        {
            titles.Add(finalScore switch
            {
                2 => MeasureTitleKeys.CategoryHigh,
                1 => MeasureTitleKeys.CategoryMedium,
                _ => MeasureTitleKeys.CategoryLow
            });
        }

        return new BlodlipiderEvaluationResult(measurementCategoryId, finalScore, titles);
    }

    private async Task EnsureQuestionLookupAsync()
    {
        if (_questionLookupLoaded) return;

        var texts = await _db.QuestionTexts
            .AsNoTracking()
            .Where(t => t.LanguageCode == "no" &&
                        (t.Text.ToLower().Contains("hjerte") || t.Text.ToLower().Contains("karsykdom") || t.Text.ToLower().Contains("diabetes")))
            .Select(t => new { t.QuestionId, t.Text })
            .ToListAsync();

        _heartDiseaseQuestionId = texts
            .FirstOrDefault(t => t.Text.Contains("hjerte", StringComparison.OrdinalIgnoreCase))?.QuestionId;

        _diabetesQuestionId = texts
            .FirstOrDefault(t => t.Text.Contains("diabetes", StringComparison.OrdinalIgnoreCase))?.QuestionId;

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
