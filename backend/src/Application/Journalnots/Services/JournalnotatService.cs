using backend.src.Application.Journalnots.DTOs;
using backend.src.Application.Journalnots.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Journalnots.Services;

public class JournalnotatService : IJournalnotatService
{
    private readonly AppDbContext _db;

    public JournalnotatService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<JournalnotatDto>> GetByPatientIdAsync(int patientId, int personnelId)
    {
        return await _db.Journalnots
            .AsNoTracking()
            .Where(j => j.PatientId == patientId && (!j.IsPrivate || j.PersonnelId == personnelId))
            .Include(j => j.CreatedBy)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => ToDto(j))
            .ToListAsync();
    }

    public async Task<JournalnotatDto> CreateAsync(CreateJournalnotatDto dto, int personnelId)
    {
        var entity = new Journalnotat
        {
            PatientId = dto.PatientId,
            PersonnelId = personnelId,
            Type = dto.Type.Trim(),
            Title = dto.Title.Trim(),
            Content = dto.Content,
            IsPrivate = dto.IsPrivate,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Journalnots.Add(entity);
        await _db.SaveChangesAsync();

        await _db.Entry(entity).Reference(j => j.CreatedBy).LoadAsync();

        return ToDto(entity);
    }

    public async Task<JournalnotatDto?> UpdateAsync(int id, UpdateJournalnotatDto dto, int personnelId)
    {
        var entity = await _db.Journalnots
            .Include(j => j.CreatedBy)
            .FirstOrDefaultAsync(j => j.JournalnotatId == id);

        if (entity == null) return null;
        if (entity.PersonnelId != personnelId) return null;

        entity.Type = dto.Type.Trim();
        entity.Title = dto.Title.Trim();
        entity.Content = dto.Content;
        entity.IsPrivate = dto.IsPrivate;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(entity);
    }

    public async Task<bool> DeleteAsync(int id, int personnelId)
    {
        var entity = await _db.Journalnots.FirstOrDefaultAsync(j => j.JournalnotatId == id);
        if (entity == null) return false;
        if (entity.PersonnelId != personnelId) return false;
        if (entity.SignedAt != null) return false; // Kan ikke slette godkjente notater

        _db.Journalnots.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<JournalnotatDto?> SignAsync(int id, int personnelId)
    {
        var entity = await _db.Journalnots
            .Include(j => j.CreatedBy)
            .FirstOrDefaultAsync(j => j.JournalnotatId == id);

        if (entity == null) return null;
        if (entity.SignedAt != null) return null; // Allerede signert

        entity.SignedAt = DateTime.UtcNow;
        entity.SignedByPersonnelId = personnelId;

        await _db.SaveChangesAsync();
        return ToDto(entity);
    }

    private static JournalnotatDto ToDto(Journalnotat j)
    {
        return new JournalnotatDto
        {
            JournalnotatId = j.JournalnotatId,
            PatientId = j.PatientId,
            PersonnelId = j.PersonnelId,
            PersonnelName = j.CreatedBy?.Name ?? "",
            Type = j.Type,
            Title = j.Title,
            Content = j.Content,
            CreatedAt = j.CreatedAt,
            UpdatedAt = j.UpdatedAt,
            IsPrivate = j.IsPrivate,
            SignedAt = j.SignedAt,
            SignedByPersonnelId = j.SignedByPersonnelId,
        };
    }
}
