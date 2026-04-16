using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

/// <summary>
/// Implements the clinical body data (kroppsdata) scoring flowchart.
///
/// BMI scoring (from MeasurementResults height=2, weight=1):
///   18.5–24.9 → 0 (LAV)
///   25–29.9   → 1 (MIDDELS)
///   ≥30       → 2 (HØY)
///
/// Weight gain (Q16, boolean "ja"/"nei"):
///   Ja → +1 added to BMI score (capped at 2)
///
/// Waist scoring (MeasurementId=3), gender-dependent:
///   Men   ≥102 cm → 2, else 0
///   Women ≥88  cm → 2, else 0
///   Any gender: ≥5 cm increase from previous measurement → score at least 1
///
/// Final score = max(bmi_combined, waist_score)
///
/// Patient measure titles:
///   "kroppsdata_lav"     – score 0
///   "kroppsdata_middels" – score 1
///   "kroppsdata_hoy"     – score 2
/// </summary>
public record KroppsDataEvaluationResult(int Score, IReadOnlyList<string> Titles);

public class KroppsDataEvaluationService
{
    private readonly AppDbContext _db;

    private const int WeightMeasurementId = 1;
    private const int HeightMeasurementId = 2;
    private const int WaistMeasurementId = 3;
    private const int WeightGainQuestionId = 16;
    private const int KroppsDataCategoryId = 9;

    public KroppsDataEvaluationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<KroppsDataEvaluationResult?> EvaluateAsync(
        int patientId,
        IReadOnlyDictionary<int, Response> responses)
    {
        var patient = await _db.Patients
            .AsNoTracking()
            .Where(p => p.Id == patientId)
            .Select(p => new { p.Gender })
            .FirstOrDefaultAsync();

        var measurementRows = await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId &&
                        (r.MeasurementId == WeightMeasurementId ||
                         r.MeasurementId == HeightMeasurementId ||
                         r.MeasurementId == WaistMeasurementId))
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        var latestWeight = measurementRows.FirstOrDefault(r => r.MeasurementId == WeightMeasurementId)?.Result;
        var latestHeight = measurementRows.FirstOrDefault(r => r.MeasurementId == HeightMeasurementId)?.Result;

        var waistHistory = measurementRows
            .Where(r => r.MeasurementId == WaistMeasurementId)
            .ToList();

        var latestWaist = waistHistory.ElementAtOrDefault(0)?.Result;
        var previousWaist = waistHistory.ElementAtOrDefault(1)?.Result;

        bool hasHighTrigger = false;
        bool hasMediumTrigger = false;

        if (!latestWeight.HasValue && !latestWaist.HasValue)
        {
            return null;
        }

        if (latestWeight.HasValue && latestHeight.HasValue && latestHeight.Value > 0)
        {
            var heightM = latestHeight.Value / 100m;
            var bmi = latestWeight.Value / (heightM * heightM);

            if (bmi >= 30m)
            {
                hasHighTrigger = true;
            }
            else if (bmi >= 25m)
            {
                hasMediumTrigger = true;
            }
        }

        if (responses.TryGetValue(WeightGainQuestionId, out var weightGainResponse) &&
            string.Equals(weightGainResponse.TextValue, "ja", StringComparison.OrdinalIgnoreCase))
        {
            hasMediumTrigger = true;
        }

        if (latestWaist.HasValue)
        {
            var gender = patient?.Gender ?? "";
            bool highWaist = gender.Equals("Mann", StringComparison.OrdinalIgnoreCase)
                ? latestWaist.Value >= 102m
                : latestWaist.Value >= 88m;

            if (highWaist)
            {
                hasHighTrigger = true;
            }
            else if (previousWaist.HasValue && latestWaist.Value - previousWaist.Value >= 5m)
            {
                hasMediumTrigger = true;
            }
        }

        int finalScore = hasHighTrigger
            ? 2
            : hasMediumTrigger
                ? 1
                : 0;

        var title = finalScore switch
        {
            0 => "Lav risiko for overvekt",
            1 => "Middels risiko overvekt",
            2 => "Høy risiko overvekt",
            _ => "Middels risiko overvekt"
        };

        var titles = finalScore switch
        {
            0 => new List<string> { title },
            1 => new List<string> { title, "Kostholdsråd" },
            2 => new List<string> { title, "Kostholdsråd" },
            _ => new List<string> { title }
        };

        return new KroppsDataEvaluationResult(finalScore, titles);
    }
}
