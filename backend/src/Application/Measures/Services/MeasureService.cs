using System.Linq.Expressions;
using System.Linq;
using backend.src.Application.Measures.DTOs;
using backend.src.Application.Measures.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Measures.Services;

public class PatientMeasureService : IPatientMeasureService
{
    private readonly AppDbContext _db;

    public PatientMeasureService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<PatientMeasureDto>> GetAllAsync()
    {
        return await _db.PatientMeasures
            .AsNoTracking()
            .Select(MeasureMapper.ToPatientDto)
            .ToListAsync();
    }

    public async Task<PatientMeasureDto> CreateAsync(CreatePatientMeasureDto dto)
    {
        MeasureValidation.Validate(dto);

        var entity = new PatientMeasure
        {
            QuestionId = dto.QuestionId,
            CategoryId = dto.CategoryId,
            ScoreThreshold = dto.ScoreThreshold,
            IsExclusive = dto.IsExclusive,
            Priority = dto.Priority,
            TriggerType = dto.TriggerType,
            RequiredOption = dto.RequiredOption,
            RequiredText = MeasureValidation.Sanitize(dto.RequiredText),
            RequiredValue = dto.RequiredValue,
            Operator = MeasureValidation.NormalizeOperator(dto),
            FallbackText = dto.FallbackText.Trim()
        };

        _db.PatientMeasures.Add(entity);
        await _db.SaveChangesAsync();

        return MeasureMapper.FromEntity(entity);
    }
}

public class PersonnelMeasureService : IPersonnelMeasureService
{
    private readonly AppDbContext _db;

    public PersonnelMeasureService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<PersonnelMeasureDto>> GetAllAsync()
    {
        return await _db.PersonnelMeasures
            .AsNoTracking()
            .Select(MeasureMapper.ToPersonnelDto)
            .ToListAsync();
    }

    public async Task<PersonnelMeasureDto> CreateAsync(CreatePersonnelMeasureDto dto)
    {
        MeasureValidation.Validate(dto);

        var entity = new PersonnelMeasure
        {
            QuestionId = dto.QuestionId,
            CategoryId = dto.CategoryId,
            ScoreThreshold = dto.ScoreThreshold,
            IsExclusive = dto.IsExclusive,
            Priority = dto.Priority,
            TriggerType = dto.TriggerType,
            RequiredOption = dto.RequiredOption,
            RequiredText = MeasureValidation.Sanitize(dto.RequiredText),
            RequiredValue = dto.RequiredValue,
            Operator = MeasureValidation.NormalizeOperator(dto),
            FallbackText = dto.FallbackText.Trim()
        };

        _db.PersonnelMeasures.Add(entity);
        await _db.SaveChangesAsync();

        return MeasureMapper.FromEntity(entity);
    }
}

internal static class MeasureValidation
{
    public static void Validate(BaseCreateMeasureDto dto)
    {
        if (dto.TriggerType == MeasureTriggerType.Question && !dto.QuestionId.HasValue)
        {
            throw new InvalidOperationException("QuestionId must be provided for question triggers.");
        }

        if (dto.TriggerType == MeasureTriggerType.Question && string.IsNullOrWhiteSpace(dto.Operator))
        {
            throw new InvalidOperationException("Operator must be provided for question triggers.");
        }

        if (dto.TriggerType == MeasureTriggerType.Category && !dto.CategoryId.HasValue)
        {
            throw new InvalidOperationException("CategoryId must be provided for category triggers.");
        }

        if (dto.ScoreThreshold < 0)
        {
            throw new InvalidOperationException("ScoreThreshold cannot be negative.");
        }
    }

    public static string? NormalizeOperator(BaseCreateMeasureDto dto)
    {
        if (dto.TriggerType == MeasureTriggerType.Question)
        {
            return (dto.Operator ?? string.Empty).Trim();
        }

        return null;
    }
    public static string? Sanitize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

internal static class MeasureMapper
{
    public static readonly Expression<Func<PatientMeasure, PatientMeasureDto>> ToPatientDto = measure => new PatientMeasureDto
    {
        PatientMeasureId = measure.PatientMeasureId,
        QuestionId = measure.QuestionId,
        CategoryId = measure.CategoryId,
        ScoreThreshold = measure.ScoreThreshold,
        IsExclusive = measure.IsExclusive,
        Priority = measure.Priority,
        TriggerType = measure.TriggerType,
        RequiredOption = measure.RequiredOption,
        RequiredText = measure.RequiredText,
        RequiredValue = measure.RequiredValue,
        Operator = measure.Operator,
        FallbackText = measure.FallbackText
    };

    public static readonly Expression<Func<PersonnelMeasure, PersonnelMeasureDto>> ToPersonnelDto = measure => new PersonnelMeasureDto
    {
        PersonnelMeasureId = measure.PersonnelMeasureId,
        QuestionId = measure.QuestionId,
        CategoryId = measure.CategoryId,
        ScoreThreshold = measure.ScoreThreshold,
        IsExclusive = measure.IsExclusive,
        Priority = measure.Priority,
        TriggerType = measure.TriggerType,
        RequiredOption = measure.RequiredOption,
        RequiredText = measure.RequiredText,
        RequiredValue = measure.RequiredValue,
        Operator = measure.Operator,
        FallbackText = measure.FallbackText
    };

    public static PatientMeasureDto FromEntity(PatientMeasure measure) => new PatientMeasureDto
    {
        PatientMeasureId = measure.PatientMeasureId,
        QuestionId = measure.QuestionId,
        CategoryId = measure.CategoryId,
        ScoreThreshold = measure.ScoreThreshold,
        IsExclusive = measure.IsExclusive,
        Priority = measure.Priority,
        TriggerType = measure.TriggerType,
        RequiredOption = measure.RequiredOption,
        RequiredText = measure.RequiredText,
        RequiredValue = measure.RequiredValue,
        Operator = measure.Operator,
        FallbackText = measure.FallbackText
    };

    public static PersonnelMeasureDto FromEntity(PersonnelMeasure measure) => new PersonnelMeasureDto
    {
        PersonnelMeasureId = measure.PersonnelMeasureId,
        QuestionId = measure.QuestionId,
        CategoryId = measure.CategoryId,
        ScoreThreshold = measure.ScoreThreshold,
        IsExclusive = measure.IsExclusive,
        Priority = measure.Priority,
        TriggerType = measure.TriggerType,
        RequiredOption = measure.RequiredOption,
        RequiredText = measure.RequiredText,
        RequiredValue = measure.RequiredValue,
        Operator = measure.Operator,
        FallbackText = measure.FallbackText
    };
}


