using backend.src.Application.Measurements.DTOs;
using backend.src.Application.Measurements.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measurements.Services;

public class MeasurementService : IMeasurementService
{
    private readonly AppDbContext _db;

    public MeasurementService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<MeasurementDto>> GetAllAsync()
    {
        return await _db.Measurements
            .AsNoTracking()
            .Select(m => new MeasurementDto
            {
                MeasurementId = m.MeasurementId,
                CategoryId = m.CategoryId,
                CategoryName = m.Category != null ? m.Category.Name : null,
                Unit = m.Unit,
                FallbackText = m.FallbackText
            })
            .ToListAsync();
    }

    public async Task<MeasurementDto> CreateAsync(CreateMeasurementDto dto)
    {
        var entity = new Measurement
        {
            CategoryId = dto.CategoryId,
            Unit = dto.Unit.Trim(),
            FallbackText = dto.FallbackText.Trim()
        };

        _db.Measurements.Add(entity);
        await _db.SaveChangesAsync();

        return new MeasurementDto
        {
            MeasurementId = entity.MeasurementId,
            CategoryId = entity.CategoryId,
            CategoryName = null,
            Unit = entity.Unit,
            FallbackText = entity.FallbackText
        };
    }
}
