using backend.src.Application.Questions.DTOs;
using backend.src.Application.Questions.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Questions.Services;

public class QuestionService : IQuestionService
{
    private readonly AppDbContext _db;

    public QuestionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<QuestionDto>> GetAllAsync()
    {
        return await _db.Questions
            .AsNoTracking()
            .Select(q => new QuestionDto
            {
                QuestionId = q.QuestionId,
                CategoryId = q.CategoryId,
                CategoryName = q.Category != null ? q.Category.Name : null,
                FallbackText = q.FallbackText,
                QuestionType = q.QuestionType,
                IsRequired = q.IsRequired,
                RequiredRole = q.RequiredRole
            })
            .ToListAsync();
    }

    public async Task<QuestionDto> CreateAsync(CreateQuestionDto dto)
    {
        var entity = new Question
        {
            CategoryId = dto.CategoryId,
            FallbackText = dto.FallbackText.Trim(),
            QuestionType = dto.QuestionType.Trim(),
            IsRequired = dto.IsRequired,
            RequiredRole = string.IsNullOrWhiteSpace(dto.RequiredRole) ? null : dto.RequiredRole.Trim()
        };

        _db.Questions.Add(entity);
        await _db.SaveChangesAsync();

        return new QuestionDto
        {
            QuestionId = entity.QuestionId,
            CategoryId = entity.CategoryId,
            CategoryName = null,
            FallbackText = entity.FallbackText,
            QuestionType = entity.QuestionType,
            IsRequired = entity.IsRequired,
            RequiredRole = entity.RequiredRole
        };
    }
}
