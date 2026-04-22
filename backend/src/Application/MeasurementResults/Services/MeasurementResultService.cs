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

        return entities.Select(r => new MeasurementResultDto
        {
            MeasurementId = r.MeasurementId,
            PatientId = r.PatientId,
            Result = r.Result,
            RegisteredBy = r.RegisteredBy,
            RegisteredAt = r.RegisteredAt,
        });
    }

    public async Task<IEnumerable<MeasurementResultDto>> GetLatestForPatientAsync(int patientId)
    {
        var all = await _db.MeasurementResults
            .AsNoTracking()
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
                RegisteredAt = DateTime.SpecifyKind(r.RegisteredAt, DateTimeKind.Utc),
            });
    }

    public async Task<IEnumerable<MeasurementResultDto>> GetAllForPatientAsync(int patientId)
    {
        return await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.RegisteredAt)
            .Select(r => new MeasurementResultDto
            {
                MeasurementId = r.MeasurementId,
                PatientId = r.PatientId,
                Result = r.Result,
                RegisteredBy = r.RegisteredBy,
                RegisteredAt = DateTime.SpecifyKind(r.RegisteredAt, DateTimeKind.Utc),
            })
            .ToListAsync();
    }
}
