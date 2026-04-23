using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

/// <summary>
/// Implementerer blodtrykk-scoring basert på siste målte systolisk og diastolisk blodtrykk.
///
/// Systolisk scoring (MeasurementId=11):
///   >= 160      → 2 (HØY)
///   140–159     → 1 (MIDDELS)
///   &lt; 140    → 0 (LAV)
///
/// Diastolisk scoring (MeasurementId=12):
///   >= 90       → 1 (MIDDELS/HØY)
///   &lt; 90     → 0 (LAV)
///
/// Endelig score = max(systolisk, diastolisk)
///
/// Titler returnert av EvaluateAsync (brukt til oppslag i PatientMeasures/PersonnelMeasures):
///   Score 0:          "blodtrykk_lav"
///   Score 1:          "blodtrykk_middels"
///   Score 2:          "blodtrykk_hoy"
///   Score >= 1, flere målinger:     "blodtrykk_malingsteknikk"   (pasienttiltak)
///   Score >= 1, kun én måling:      "Tips for korrekt blodtrykksmåling"     (behandlertiltak)
/// </summary>
public record BlodtrykkEvaluationResult(
    int CategoryId,
    int Score,
    IReadOnlyList<string> Titles,
    DateTime? BasedOnDate,
    string? BasedOnPersonnelName);

public class BlodtrykkEvaluationService
{
    private readonly AppDbContext _db;

    private const int SystolicMeasurementId = 11;
    private const int DiastolicMeasurementId = 12;
    public const int BlodtrykkCategoryId = 14;

    public BlodtrykkEvaluationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BlodtrykkEvaluationResult?> EvaluateAsync(int patientId)
    {
        var allRows = await _db.MeasurementResults
            .AsNoTracking()
            .Include(r => r.RegisteredByPersonnel)
            .Where(r => r.PatientId == patientId &&
                        (r.MeasurementId == SystolicMeasurementId ||
                         r.MeasurementId == DiastolicMeasurementId))
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        if (allRows.Count == 0) return null;

        var latestSystolic = allRows
            .FirstOrDefault(r => r.MeasurementId == SystolicMeasurementId)?.Result;
        var latestDiastolic = allRows
            .FirstOrDefault(r => r.MeasurementId == DiastolicMeasurementId)?.Result;

        if (!latestSystolic.HasValue && !latestDiastolic.HasValue) return null;

        // Finnes det flere målinger (ulike datoer)?
        bool hasMultipleMeasurements = allRows
            .Select(r => r.RegisteredAt.Date)
            .Distinct()
            .Count() > 1;

        // Additivt opplegg – speiler severity-reglene i DB:
        //   systolisk >= 140 → +1, >= 160 → +1 til
        //   diastolisk >= 90 → +1
        int systolicScore = 0;
        if (latestSystolic.HasValue)
        {
            if (latestSystolic.Value >= 140) systolicScore++;
            if (latestSystolic.Value >= 160) systolicScore++;
        }

        int diastolicScore = latestDiastolic.HasValue && latestDiastolic.Value >= 90 ? 1 : 0;

        int score = systolicScore + diastolicScore;

        var titles = new List<string>();

        if (score == 0)
        {
            titles.Add("Normalt blodtrykk");
        }
        else
        {
            titles.Add(score >= 2 ? "Høyt blodtrykk" : "Noe høyt blodtrykk");

            if (hasMultipleMeasurements)
                titles.Add("Tips for korrekt blodtrykksmåling");
        }

        var mostRecentRow = allRows.FirstOrDefault();
        var basedOnDate = mostRecentRow?.RegisteredAt;
        var basedOnPersonnelName = mostRecentRow?.RegisteredByPersonnel?.Name;

        return new BlodtrykkEvaluationResult(BlodtrykkCategoryId, score, titles, basedOnDate, basedOnPersonnelName);
    }
}
