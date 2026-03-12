using backend.src.Application.QuestionOptions.DTOs;
using backend.src.Application.QuestionOptions.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.QuestionOptions.Services;

public class QuestionOptionService : IQuestionOptionService
{
    private readonly AppDbContext _db;

    public QuestionOptionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<QuestionOptionDto>> GetAllAsync()
    {
        return await _db.QuestionOptions
            .AsNoTracking()
            .Select(o => new QuestionOptionDto
            {
                QuestionOptionId = o.QuestionOptionId,
                QuestionId = o.QuestionId,
                FallbackText = o.FallbackText,
                OptionValue = o.OptionValue,
                DisplayOrder = o.DisplayOrder
            })
            .ToListAsync();
    }

    public async Task<QuestionOptionDto> CreateAsync(CreateQuestionOptionDto dto)
    {
        var entity = new QuestionOption
        {
            QuestionId = dto.QuestionId,
            FallbackText = dto.FallbackText.Trim(),
            OptionValue = dto.OptionValue.Trim(),
            DisplayOrder = dto.DisplayOrder
        };

        _db.QuestionOptions.Add(entity);
        await _db.SaveChangesAsync();

        return new QuestionOptionDto
        {
            QuestionOptionId = entity.QuestionOptionId,
            QuestionId = entity.QuestionId,
            FallbackText = entity.FallbackText,
            OptionValue = entity.OptionValue,
            DisplayOrder = entity.DisplayOrder
        };
    }
}
