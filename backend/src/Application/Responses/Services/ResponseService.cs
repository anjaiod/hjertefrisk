using backend.src.Application.Responses.DTOs;
using backend.src.Application.Responses.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Responses.Services;

public class ResponseService : IResponseService
{
    private readonly AppDbContext _db;

    public ResponseService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ResponseDto>> GetAllAsync()
    {
        return await _db.Responses
            .AsNoTracking()
            .Select(r => new ResponseDto
            {
                PatientId = r.PatientId,
                QuestionId = r.QuestionId,
                SelectedOptionId = r.SelectedOptionId,
                TextValue = r.TextValue,
                NumberValue = r.NumberValue,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ResponseDto> CreateAsync(CreateResponseDto dto)
    {
        var entity = new Response
        {
            PatientId = dto.PatientId,
            QuestionId = dto.QuestionId,
            SelectedOptionId = dto.SelectedOptionId,
            TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
            NumberValue = dto.NumberValue
        };

        _db.Responses.Add(entity);
        await _db.SaveChangesAsync();

        return new ResponseDto
        {
            PatientId = entity.PatientId,
            QuestionId = entity.QuestionId,
            SelectedOptionId = entity.SelectedOptionId,
            TextValue = entity.TextValue,
            NumberValue = entity.NumberValue,
            CreatedAt = entity.CreatedAt
        };
    }
}
