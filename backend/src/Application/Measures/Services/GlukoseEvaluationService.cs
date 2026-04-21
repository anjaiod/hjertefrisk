using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

/// <summary>
/// Evaluerer glukoseregulering basert på siste HbA1c-måling registrert av behandler.
///
/// Scoring (speiler thresholds vist i pasienttiltaksdiagrammet):
///   HbA1c >= 48 mmol/mol  → 2 (HØY)
///   HbA1c 42–47 mmol/mol  → 1 (MIDDELS)
///   HbA1c < 42 mmol/mol   → 0 (LAV)
///
/// CategoryId hentes dynamisk fra Measurements-tabellen.
/// </summary>
public record GlukoseEvaluationResult(int CategoryId, int Score, DateTime? BasedOnDate, string? BasedOnPersonnelName);

public class GlukoseEvaluationService
{
    private readonly AppDbContext _db;
    private const string GlukoseCategoryName = "Glukoseregulering";

    public GlukoseEvaluationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<GlukoseEvaluationResult?> EvaluateAsync(int patientId)
    {
        // Slå opp glukose-kategorien dynamisk basert på navn
        var glukoseCategory = await _db.Categories
            .AsNoTracking()
            .Where(c => c.Name.ToLower() == GlukoseCategoryName.ToLower())
            .Select(c => c.CategoryId)
            .FirstOrDefaultAsync();

        if (glukoseCategory == 0) return null;

        // Finn alle målinger knyttet til glukose-kategorien
        var measurementIds = await _db.Measurements
            .AsNoTracking()
            .Where(m => m.CategoryId == glukoseCategory)
            .Select(m => m.MeasurementId)
            .ToListAsync();

        if (measurementIds.Count == 0) return null;

        // Hent siste måling for pasienten
        var latest = await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId && measurementIds.Contains(r.MeasurementId))
            .OrderByDescending(r => r.RegisteredAt)
            .Select(r => new
            {
                Result = (decimal?)r.Result,
                r.RegisteredAt,
                PersonnelName = r.RegisteredByPersonnel != null ? r.RegisteredByPersonnel.Name : null
            })
            .FirstOrDefaultAsync();

        if (latest is null || !latest.Result.HasValue) return null;

        var hba1c = latest.Result.Value;
        int score = hba1c >= 48 ? 2 : hba1c >= 42 ? 1 : 0;

        return new GlukoseEvaluationResult(glukoseCategory, score, latest.RegisteredAt, latest.PersonnelName);
    }
}
