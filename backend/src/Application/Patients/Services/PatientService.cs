using backend.src.Application.Patients.DTOs;
using backend.src.Application.Patients.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Patients.Services;

public class PatientService : IPatientService
{
    private readonly AppDbContext _db;

    public PatientService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<PatientDto>> GetAllAsync()
    {
        return await _db.Patients
            .AsNoTracking()
            .Select(p => new PatientDto
            {
                Id = p.Id,
                SupabaseUserId = p.SupabaseUserId,
                Name = p.Name,
                Email = p.Email,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<PatientDto?> GetBySupabaseUserIdAsync(string supabaseUserId)
    {
        var trimmed = supabaseUserId.Trim();
        if (string.IsNullOrWhiteSpace(trimmed)) return null;

        return await _db.Patients
            .AsNoTracking()
            .Where(p => p.SupabaseUserId == trimmed)
            .Select(p => new PatientDto
            {
                Id = p.Id,
                SupabaseUserId = p.SupabaseUserId,
                Name = p.Name,
                Email = p.Email,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<PatientDto> CreateAsync(CreatePatientDto dto)
    {
        var entity = new Patient
        {
            SupabaseUserId = dto.SupabaseUserId.Trim(),
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim()
        };

        _db.Patients.Add(entity);
        await _db.SaveChangesAsync();

        return new PatientDto
        {
            Id = entity.Id,
            SupabaseUserId = entity.SupabaseUserId,
            Name = entity.Name,
            Email = entity.Email,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<int> GetTotalScoreAsync(int patientId)
    {
        var responses = await _db.Responses
            .AsNoTracking()
            .Where(r => r.PatientId == patientId)
            .ToListAsync();

        var questionIds = responses.Select(r => r.QuestionId).Distinct().ToList();
        var questionSeverities = await _db.Severities
            .AsNoTracking()
            .Where(s => s.QuestionId != null && questionIds.Contains(s.QuestionId.Value))
            .ToListAsync();

        // Avoid EF Core GroupBy/First translation issues by grouping in-memory.
        var measurementRows = await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        var latestMeasurementResults = measurementRows
            .GroupBy(r => r.MeasurementId)
            .Select(g => g.First())
            .ToList();

        var measurementIds = latestMeasurementResults.Select(r => r.MeasurementId).Distinct().ToList();
        var measurementSeverities = await _db.Severities
            .AsNoTracking()
            .Where(s => s.MeasurementId != null && measurementIds.Contains(s.MeasurementId.Value))
            .ToListAsync();

        var totalScore = 0;

        foreach (var severity in questionSeverities)
        {
            var response = responses.FirstOrDefault(r => r.QuestionId == severity.QuestionId);
            if (response == null) continue;

            if (IsSeverityMatch(severity, response.SelectedOptionId, response.TextValue, response.NumberValue))
            {
                totalScore += severity.Score;
            }
        }

        foreach (var severity in measurementSeverities)
        {
            var measurementResult = latestMeasurementResults
                .FirstOrDefault(r => r.MeasurementId == severity.MeasurementId);
            if (measurementResult == null) continue;

            if (IsSeverityMatch(severity, null, null, measurementResult.Result))
            {
                totalScore += severity.Score;
            }
        }

        return totalScore;
    }

    public async Task<IEnumerable<LatestMeasurementResultDto>> GetLatestMeasurementsAsync(int patientId)
    {
        // We only need weight (1) + height (2) for the dashboard.
        // Avoid GroupBy translation issues by grouping in-memory.
        var rows = await _db.MeasurementResults
            .AsNoTracking()
            .Where(r => r.PatientId == patientId && (r.MeasurementId == 1 || r.MeasurementId == 2))
            .OrderByDescending(r => r.RegisteredAt)
            .ToListAsync();

        return rows
            .GroupBy(r => r.MeasurementId)
            .Select(g => g.First())
            .Select(r => new LatestMeasurementResultDto
            {
                MeasurementId = r.MeasurementId,
                Result = r.Result,
                RegisteredAt = r.RegisteredAt
            })
            .ToList();
    }

    private static bool IsSeverityMatch(Severity severity, int? optionId, string? textValue, decimal? numberValue)
    {
        var hasAnyCondition = severity.RequiredOption != null
            || !string.IsNullOrWhiteSpace(severity.RequiredText)
            || severity.RequiredValue != null;

        if (!hasAnyCondition)
        {
            return false;
        }

        if (severity.RequiredOption != null && optionId != null)
        {
            if (optionId.Value == severity.RequiredOption.Value)
            {
                return true;
            }
        }

        if (!string.IsNullOrWhiteSpace(severity.RequiredText) && !string.IsNullOrWhiteSpace(textValue))
        {
            var requiredText = severity.RequiredText.Trim();
            var candidateText = textValue.Trim();

            if (severity.Operator.Equals("contains", StringComparison.OrdinalIgnoreCase))
            {
                if (candidateText.Contains(requiredText, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            else if (severity.Operator == "==")
            {
                if (string.Equals(candidateText, requiredText, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            else if (severity.Operator == "!=")
            {
                if (!string.Equals(candidateText, requiredText, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
        }

        if (severity.RequiredValue != null && numberValue != null)
        {
            var left = numberValue.Value;
            var right = severity.RequiredValue.Value;

            switch (severity.Operator)
            {
                case "==":
                    return left == right;
                case "!=":
                    return left != right;
                case ">":
                    return left > right;
                case ">=":
                    return left >= right;
                case "<":
                    return left < right;
                case "<=":
                    return left <= right;
            }
        }

        return false;
    }
}
