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

    public async Task<IEnumerable<ResponseDto>> UpsertManyAsync(IEnumerable<CreateResponseDto> dtos)
    {
        var incoming = dtos
            .Select(dto => new CreateResponseDto
            {
                PatientId = dto.PatientId,
                QuestionId = dto.QuestionId,
                SelectedOptionId = dto.SelectedOptionId,
                TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
                NumberValue = dto.NumberValue
            })
            .ToList();

        if (incoming.Count == 0)
        {
            return Array.Empty<ResponseDto>();
        }

        await using var transaction = await _db.Database.BeginTransactionAsync();

        var patientIds = incoming.Select(x => x.PatientId).Distinct().ToList();
        var questionIds = incoming.Select(x => x.QuestionId).Distinct().ToList();

        var existingResponses = await _db.Responses
            .Where(r => patientIds.Contains(r.PatientId) && questionIds.Contains(r.QuestionId))
            .ToListAsync();

        var existingByKey = existingResponses.ToDictionary(
            response => (response.PatientId, response.QuestionId));

        foreach (var dto in incoming)
        {
            var key = (dto.PatientId, dto.QuestionId);

            if (existingByKey.TryGetValue(key, out var existing))
            {
                existing.SelectedOptionId = dto.SelectedOptionId;
                existing.TextValue = dto.TextValue;
                existing.NumberValue = dto.NumberValue;
                continue;
            }

            var created = new Response
            {
                PatientId = dto.PatientId,
                QuestionId = dto.QuestionId,
                SelectedOptionId = dto.SelectedOptionId,
                TextValue = dto.TextValue,
                NumberValue = dto.NumberValue
            };

            _db.Responses.Add(created);
            existingByKey[key] = created;
        }

        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        return incoming
            .Select(dto => existingByKey[(dto.PatientId, dto.QuestionId)])
            .Select(entity => new ResponseDto
            {
                PatientId = entity.PatientId,
                QuestionId = entity.QuestionId,
                SelectedOptionId = entity.SelectedOptionId,
                TextValue = entity.TextValue,
                NumberValue = entity.NumberValue,
                CreatedAt = entity.CreatedAt
            })
            .ToList();
    }
}
