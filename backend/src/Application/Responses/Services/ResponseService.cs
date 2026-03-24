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
                AnsweredQueryId = r.AnsweredQueryId,
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
        var answeredQuery = new AnsweredQuery { PatientId = dto.PatientId };
        _db.AnsweredQueries.Add(answeredQuery);
        await _db.SaveChangesAsync();

        var entity = new Response
        {
            AnsweredQueryId = answeredQuery.Id,
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
            AnsweredQueryId = entity.AnsweredQueryId,
            PatientId = entity.PatientId,
            QuestionId = entity.QuestionId,
            SelectedOptionId = entity.SelectedOptionId,
            TextValue = entity.TextValue,
            NumberValue = entity.NumberValue,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<IEnumerable<ResponseDto>> UpsertManyAsync(IEnumerable<CreateResponseDto> dtos)
    {
        var incoming = dtos.ToList();
        if (incoming.Count == 0)
            return Array.Empty<ResponseDto>();

        // Create one AnsweredQuery per bulk submission
        var answeredQuery = new AnsweredQuery { PatientId = incoming[0].PatientId };
        _db.AnsweredQueries.Add(answeredQuery);
        await _db.SaveChangesAsync();

        var entities = incoming.Select(dto => new Response
        {
            AnsweredQueryId = answeredQuery.Id,
            PatientId = dto.PatientId,
            QuestionId = dto.QuestionId,
            SelectedOptionId = dto.SelectedOptionId,
            TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
            NumberValue = dto.NumberValue
        }).ToList();

        _db.Responses.AddRange(entities);
        await _db.SaveChangesAsync();

        return entities.Select(r => new ResponseDto
        {
            AnsweredQueryId = r.AnsweredQueryId,
            PatientId = r.PatientId,
            QuestionId = r.QuestionId,
            SelectedOptionId = r.SelectedOptionId,
            TextValue = r.TextValue,
            NumberValue = r.NumberValue,
            CreatedAt = r.CreatedAt
        });
    }
}
