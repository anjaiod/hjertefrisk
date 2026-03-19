using backend.src.Application.Queries.DTOs;
using backend.src.Application.Queries.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Queries.Services;

public class QueryService : IQueryService
{
    private readonly AppDbContext _db;

    public QueryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<QueryDto>> GetAllAsync()
    {
        return await _db.Queries
            .AsNoTracking()
            .Select(q => new QueryDto { Id = q.Id, Name = q.Name })
            .ToListAsync();
    }

    public async Task<QueryDto?> GetByIdAsync(int id)
    {
        return await _db.Queries
            .AsNoTracking()
            .Where(q => q.Id == id)
            .Select(q => new QueryDto { Id = q.Id, Name = q.Name })
            .FirstOrDefaultAsync();
    }

    public async Task<QueryDto> CreateAsync(CreateQueryDto dto)
    {
        var entity = new Query { Name = dto.Name };
        _db.Queries.Add(entity);
        await _db.SaveChangesAsync();
        return new QueryDto { Id = entity.Id, Name = entity.Name };
    }

    public async Task<QueryWithQuestionsDto?> GetWithQuestionsAsync(int id)
{
    var query = await _db.Queries
        .AsNoTracking()
        .Where(q => q.Id == id)
        .Select(q => new QueryWithQuestionsDto
        {
            Id = q.Id,
            Name = q.Name,
            Questions = q.QueryQuestions
                .OrderBy(qq => qq.DisplayOrder)
                .Select(qq => new QuestionWithDetailsDto
                {
                    QuestionId = qq.Question.QuestionId,
                    FallbackText = qq.Question.FallbackText,
                    QuestionType = qq.Question.QuestionType,
                    IsRequired = qq.Question.IsRequired,
                    RequiredRole = qq.Question.RequiredRole,
                    DisplayOrder = qq.DisplayOrder,
                    Options = qq.Question.Options
                        .OrderBy(o => o.DisplayOrder)
                        .Select(o => new QuestionOptionDto
                        {
                            QuestionOptionId = o.QuestionOptionId,
                            FallbackText = o.FallbackText,
                            OptionValue = o.OptionValue,
                            DisplayOrder = o.DisplayOrder
                        }).ToList(),
                    Dependencies = qq.Question.ParentDependencies
                        .Select(d => new QuestionDependencyDto
                        {
                            ParentQuestionId = d.ParentQuestionId,
                            ChildQuestionId = d.ChildQuestionId,
                            TriggerTextValue = d.TriggerTextValue,
                            Operator = d.Operator
                        }).ToList()
                }).ToList()
        })
        .FirstOrDefaultAsync();

    return query;
}

public async Task<QueryWithQuestionsDto?> GetByNameAsync(string name)
{
    return await _db.Queries
        .AsNoTracking()
        .Where(q => q.Name == name)
        .Select(q => new QueryWithQuestionsDto
        {
            Id = q.Id,
            Name = q.Name,
            Questions = q.QueryQuestions
                .OrderBy(qq => qq.DisplayOrder)
                .Select(qq => new QuestionWithDetailsDto
                {
                    QuestionId = qq.Question.QuestionId,
                    FallbackText = qq.Question.FallbackText,
                    QuestionType = qq.Question.QuestionType,
                    IsRequired = qq.Question.IsRequired,
                    RequiredRole = qq.Question.RequiredRole,
                    DisplayOrder = qq.DisplayOrder,
                    Options = qq.Question.Options
                        .OrderBy(o => o.DisplayOrder)
                        .Select(o => new QuestionOptionDto
                        {
                            QuestionOptionId = o.QuestionOptionId,
                            FallbackText = o.FallbackText,
                            OptionValue = o.OptionValue,
                            DisplayOrder = o.DisplayOrder
                        }).ToList(),
                    Dependencies = qq.Question.ParentDependencies
                        .Select(d => new QuestionDependencyDto
                        {
                            ParentQuestionId = d.ParentQuestionId,
                            ChildQuestionId = d.ChildQuestionId,
                            TriggerTextValue = d.TriggerTextValue,
                            Operator = d.Operator
                        }).ToList()
                }).ToList()
        })
        .FirstOrDefaultAsync();
}

public async Task<QueryWithQuestionsDto?> GetFullByIdAsync(int id)
{
    return await GetWithQuestionsAsync(id);
}

public async Task<QueryWithQuestionsDto?> GetFullByNameAsync(string name)
{
    return await GetByNameAsync(name);
}
}