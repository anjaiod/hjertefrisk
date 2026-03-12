using backend.src.Application.Severities.DTOs;
using backend.src.Application.Severities.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Severities.Services;

public class SeverityService : ISeverityService
{
    private readonly AppDbContext _db;

    public SeverityService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<SeverityDto>> GetAllAsync()
    {
        return await _db.Severities
            .AsNoTracking()
            .Select(s => new SeverityDto
            {
                SeverityId = s.SeverityId,
                QuestionId = s.QuestionId,
                MeasurementId = s.MeasurementId,
                RequiredOption = s.RequiredOption,
                RequiredText = s.RequiredText,
                RequiredValue = s.RequiredValue,
                Operator = s.Operator,
                Score = s.Score
            })
            .ToListAsync();
    }

    public async Task<SeverityDto> CreateAsync(CreateSeverityDto dto)
    {
        var hasQuestion = dto.QuestionId.HasValue;
        var hasMeasurement = dto.MeasurementId.HasValue;
        if (hasQuestion == hasMeasurement)
        {
            throw new InvalidOperationException("Exactly one of QuestionId or MeasurementId must be set.");
        }

        var entity = new Severity
        {
            QuestionId = dto.QuestionId,
            MeasurementId = dto.MeasurementId,
            RequiredOption = dto.RequiredOption,
            RequiredText = dto.RequiredText,
            RequiredValue = dto.RequiredValue,
            Operator = dto.Operator.Trim(),
            Score = dto.Score
        };

        _db.Severities.Add(entity);
        await _db.SaveChangesAsync();

        return new SeverityDto
        {
            SeverityId = entity.SeverityId,
            QuestionId = entity.QuestionId,
            MeasurementId = entity.MeasurementId,
            RequiredOption = entity.RequiredOption,
            RequiredText = entity.RequiredText,
            RequiredValue = entity.RequiredValue,
            Operator = entity.Operator,
            Score = entity.Score
        };
    }
}
