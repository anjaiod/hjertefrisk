using backend.src.Application.Measures.DTOs;
using backend.src.Application.Measures.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

public class MeasureService : IMeasureService
{
    private readonly AppDbContext _db;

    public MeasureService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<MeasureDto>> GetAllAsync()
    {
        return await _db.Measures
            .AsNoTracking()
            .Select(m => new MeasureDto
            {
                MeasureId = m.MeasureId,
                QuestionId = m.QuestionId,
                RequiredOption = m.RequiredOption,
                RequiredText = m.RequiredText,
                RequiredValue = m.RequiredValue,
                Operator = m.Operator,
                FallbackText = m.FallbackText
            })
            .ToListAsync();
    }

    public async Task<MeasureDto> CreateAsync(CreateMeasureDto dto)
    {
        var entity = new Measure
        {
            QuestionId = dto.QuestionId,
            RequiredOption = dto.RequiredOption,
            RequiredText = dto.RequiredText,
            RequiredValue = dto.RequiredValue,
            Operator = dto.Operator.Trim(),
            FallbackText = dto.FallbackText.Trim()
        };

        _db.Measures.Add(entity);
        await _db.SaveChangesAsync();

        return new MeasureDto
        {
            MeasureId = entity.MeasureId,
            QuestionId = entity.QuestionId,
            RequiredOption = entity.RequiredOption,
            RequiredText = entity.RequiredText,
            RequiredValue = entity.RequiredValue,
            Operator = entity.Operator,
            FallbackText = entity.FallbackText
        };
    }
}
