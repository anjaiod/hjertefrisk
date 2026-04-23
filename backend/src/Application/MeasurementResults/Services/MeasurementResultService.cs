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

        // RegisteredAt is part of the PK, so each submission always creates a new
        // history row rather than mutating an existing one.
        var now = DateTime.UtcNow;

        var entities = incoming.Select(dto => new MeasurementResult
        {
            MeasurementId = dto.MeasurementId,
            PatientId = dto.PatientId,
            Result = dto.Result,
            RegisteredBy = dto.RegisteredBy,
            RegisteredAt = now,
        }).ToList();

        _db.MeasurementResults.AddRange(entities);
        await _db.SaveChangesAsync();

        var personnelIds = entities
            .Where(r => r.RegisteredBy.HasValue)
            .Select(r => r.RegisteredBy!.Value)
            .Distinct()
            .ToList();

        var personnelNames = personnelIds.Count > 0
            ? await _db.Personnel
                .AsNoTracking()
                .Where(p => personnelIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id, p => p.Name)
            : new Dictionary<int, string>();

        return entities.Select(r => new MeasurementResultDto
        {
            MeasurementId = r.MeasurementId,
            PatientId = r.PatientId,
            Result = r.Result,
            RegisteredBy = r.RegisteredBy,
            RegisteredByName = r.RegisteredBy.HasValue && personnelNames.TryGetValue(r.RegisteredBy.Value, out var name) ? name : null,
            RegisteredAt = r.RegisteredAt,
        });
    }

    public async Task<IEnumerable<MeasurementResultDto>> GetLatestForPatientAsync(int patientId)
    {
        var all = await _db.MeasurementResults
            .AsNoTracking()
            .Include(r => r.RegisteredByPersonnel)
            .Where(r => r.PatientId == patientId)
            .ToListAsync();

        return all
            .GroupBy(r => r.MeasurementId)
            .Select(g => g.OrderByDescending(r => r.RegisteredAt).First())
            .Select(r => new MeasurementResultDto
            {
                MeasurementId = r.MeasurementId,
                PatientId = r.PatientId,
                Result = r.Result,
                RegisteredBy = r.RegisteredBy,
                RegisteredByName = r.RegisteredByPersonnel?.Name,
                RegisteredAt = DateTime.SpecifyKind(r.RegisteredAt, DateTimeKind.Utc),
            });
    }

    public async Task<IEnumerable<MeasurementResultDto>> GetAllForPatientAsync(int patientId)
    {
        return await _db.MeasurementResults
            .AsNoTracking()
            .Include(r => r.RegisteredByPersonnel)
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.RegisteredAt)
            .Select(r => new MeasurementResultDto
            {
                MeasurementId = r.MeasurementId,
                PatientId = r.PatientId,
                Result = r.Result,
                RegisteredBy = r.RegisteredBy,
                RegisteredByName = r.RegisteredByPersonnel != null ? r.RegisteredByPersonnel.Name : null,
                RegisteredAt = DateTime.SpecifyKind(r.RegisteredAt, DateTimeKind.Utc),
            })
            .ToListAsync();
    }
}
