using backend.src.Application.Responses.DTOs;
using backend.src.Application.Responses.Interfaces;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Responses.Services;

public class ResponseService : IResponseService
{
    private readonly AppDbContext _db;
    private readonly IToDoRuleService _toDoRuleService;

    public ResponseService(AppDbContext db, IToDoRuleService toDoRuleService)
    {
        _db = db;
        _toDoRuleService = toDoRuleService;
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
        var entity = new Response
        {
            AnsweredQuery = answeredQuery,
            PatientId = dto.PatientId,
            QuestionId = dto.QuestionId,
            SelectedOptionId = dto.SelectedOptionId,
            TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
            NumberValue = dto.NumberValue
        };

        _db.Responses.Add(entity);
        await _db.SaveChangesAsync();

        // Process ToDoRules for this response
        await _toDoRuleService.ProcessResponseAsync(entity);

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

        var patientId = incoming[0].PatientId;
        if (incoming.Any(x => x.PatientId != patientId))
            throw new ArgumentException("All responses in one bulk request must belong to the same patient.");

        var normalized = incoming
            .GroupBy(x => x.QuestionId)
            .Select(g => g.Last())
            .ToList();

        await using var transaction = await _db.Database.BeginTransactionAsync();

        var answeredQuery = new AnsweredQuery { PatientId = patientId };

        var entities = normalized.Select(dto => new Response
        {
            AnsweredQuery = answeredQuery,
            PatientId = patientId,
            QuestionId = dto.QuestionId,
            SelectedOptionId = dto.SelectedOptionId,
            TextValue = string.IsNullOrWhiteSpace(dto.TextValue) ? null : dto.TextValue.Trim(),
            NumberValue = dto.NumberValue
        }).ToList();

        _db.Responses.AddRange(entities);
        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        // Build a map of question IDs to their categories for score-based rules
        var questionIds = entities.Select(e => e.QuestionId).Distinct().ToList();
        var questionsWithCategories = await _db.Questions
            .AsNoTracking()
            .Where(q => questionIds.Contains(q.QuestionId))
            .Select(q => new { q.QuestionId, q.CategoryId })
            .ToListAsync();

        // Process ToDoRules for each response with calculated scores
        foreach (var entity in entities)
        {
            var questionCategory = questionsWithCategories.FirstOrDefault(q => q.QuestionId == entity.QuestionId);
            
            // Calculate category score for score-based matching
            int? categoryScore = null;
            if (questionCategory?.CategoryId.HasValue == true)
                {
                    categoryScore = await CalculateCategoryScoreAsync(patientId, questionCategory.CategoryId.Value);
                }
                
            await _toDoRuleService.ProcessResponseWithScoreAsync(entity, categoryScore);
        }
        

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

    public async Task<IEnumerable<AnsweredQueryHistoryDto>> GetHistoryForPatientAsync(int patientId)
    {
        var queries = await _db.AnsweredQueries
            .AsNoTracking()
            .Where(aq => aq.PatientId == patientId)
            .OrderByDescending(aq => aq.CreatedAt)
            .Include(aq => aq.Responses)
                .ThenInclude(r => r.Question)
                    .ThenInclude(q => q.QueryQuestions)
            .Include(aq => aq.Responses)
                .ThenInclude(r => r.SelectedOption)
            .ToListAsync();

        return queries.Select(aq => new AnsweredQueryHistoryDto
        {
            Id = aq.Id,
            CreatedAt = DateTime.SpecifyKind(aq.CreatedAt, DateTimeKind.Utc),
            Responses = aq.Responses
                .OrderBy(r => r.Question.QueryQuestions.FirstOrDefault()?.DisplayOrder ?? r.QuestionId)
                .Select(r => new ResponseHistoryItemDto
                {
                    QuestionId = r.QuestionId,
                    QuestionText = r.Question.FallbackText,
                    AnswerText = r.SelectedOption?.FallbackText ?? r.TextValue,
                    NumberValue = r.NumberValue,
                }).ToList()
        });
    }

    /// <summary>
    /// Calculates the cumulative score for a category based on patient responses.
    /// Sums numeric values from questions in the category.
    /// </summary>
    private async Task<int> CalculateCategoryScoreAsync(int patientId, int categoryId)
    {
        var score = await _db.Responses
            .AsNoTracking()
            .Where(r => r.PatientId == patientId && 
                        r.Question.CategoryId == categoryId &&
                        r.NumberValue.HasValue)
            .SumAsync(r => (int)(r.NumberValue ?? 0));

        return score;
    }
}
