using backend.src.Application.MeasurementResults.DTOs;
using backend.src.Application.MeasurementResults.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.MeasurementResults.Services;

public class MeasurementResultService : IMeasurementResultService
{
    private readonly AppDbContext _db;

    public MeasurementResultService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<MeasurementResultDto>> UpsertManyAsync(IEnumerable<CreateMeasurementResultDto> dtos)
    {
        var incoming = dtos.ToList();
        if (incoming.Count == 0)
            return Array.Empty<MeasurementResultDto>();

        var now = DateTime.UtcNow;

        await using var transaction = await _db.Database.BeginTransactionAsync();

        var patientIds = incoming.Select(x => x.PatientId).Distinct().ToList();
        var measurementIds = incoming.Select(x => x.MeasurementId).Distinct().ToList();

        // Load latest existing result per (patient, measurement) so we can update in place.
        var existingRows = await _db.MeasurementResults
            .Where(r => patientIds.Contains(r.PatientId) && measurementIds.Contains(r.MeasurementId))
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        // Group by (patientId, measurementId) and keep only the latest.
        var latestByKey = existingRows
            .GroupBy(r => (r.PatientId, r.MeasurementId))
            .ToDictionary(g => g.Key, g => g.First());

        var results = new List<MeasurementResult>();

        foreach (var dto in incoming)
        {
            var key = (dto.PatientId, dto.MeasurementId);

            if (latestByKey.TryGetValue(key, out var existing))
            {
                existing.Result = dto.Result;
                existing.RegisteredBy = dto.RegisteredBy;
                existing.RegisteredAt = now;
                results.Add(existing);
            }
            else
            {
                var created = new MeasurementResult
                {
                    MeasurementId = dto.MeasurementId,
                    PatientId = dto.PatientId,
                    Result = dto.Result,
                    RegisteredBy = dto.RegisteredBy,
                    RegisteredAt = now,
                };
                _db.MeasurementResults.Add(created);
                results.Add(created);
            }
        }

        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        return results.Select(r => new MeasurementResultDto
        {
            MeasurementId = r.MeasurementId,
            PatientId = r.PatientId,
            Result = r.Result,
            RegisteredBy = r.RegisteredBy,
            RegisteredAt = r.RegisteredAt,
        });
    }
}
