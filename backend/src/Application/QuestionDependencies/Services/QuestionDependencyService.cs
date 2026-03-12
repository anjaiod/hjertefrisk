using backend.src.Application.QuestionDependencies.DTOs;
using backend.src.Application.QuestionDependencies.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.QuestionDependencies.Services;

public class QuestionDependencyService : IQuestionDependencyService
{
    private readonly AppDbContext _db;

    public QuestionDependencyService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<QuestionDependencyDto>> GetAllAsync()
    {
        return await _db.QuestionDependencies
            .AsNoTracking()
            .Select(d => new QuestionDependencyDto
            {
                ParentQueryId = d.ParentQueryId,
                ParentQuestionId = d.ParentQuestionId,
                ChildQueryId = d.ChildQueryId,
                ChildQuestionId = d.ChildQuestionId,
                TriggerOptionId = d.TriggerOptionId,
                TriggerTextValue = d.TriggerTextValue,
                TriggerNumberValue = d.TriggerNumberValue,
                Operator = d.Operator
            })
            .ToListAsync();
    }

    public async Task<QuestionDependencyDto> CreateAsync(CreateQuestionDependencyDto dto)
    {
        var entity = new QuestionDependency
        {
            ParentQueryId = dto.ParentQueryId,
            ParentQuestionId = dto.ParentQuestionId,
            ChildQueryId = dto.ChildQueryId,
            ChildQuestionId = dto.ChildQuestionId,
            TriggerOptionId = dto.TriggerOptionId,
            TriggerTextValue = string.IsNullOrWhiteSpace(dto.TriggerTextValue) ? null : dto.TriggerTextValue.Trim(),
            TriggerNumberValue = dto.TriggerNumberValue,
            Operator = dto.Operator.Trim()
        };

        _db.QuestionDependencies.Add(entity);
        await _db.SaveChangesAsync();

        return new QuestionDependencyDto
        {
            ParentQueryId = entity.ParentQueryId,
            ParentQuestionId = entity.ParentQuestionId,
            ChildQueryId = entity.ChildQueryId,
            ChildQuestionId = entity.ChildQuestionId,
            TriggerOptionId = entity.TriggerOptionId,
            TriggerTextValue = entity.TriggerTextValue,
            TriggerNumberValue = entity.TriggerNumberValue,
            Operator = entity.Operator
        };
    }
}
