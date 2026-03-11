using backend.src.Application.Languages.DTOs;
using backend.src.Application.Languages.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Languages.Services;

public class LanguageService : ILanguageService
{
    private readonly AppDbContext _db;

    public LanguageService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<LanguageDto>> GetAllAsync()
    {
        return await _db.Language
            .AsNoTracking()
            .OrderBy(l => l.Code)
            .Select(l => new LanguageDto { Code = l.Code, Name = l.Name })
            .ToListAsync();
    }

    public async Task<LanguageDto?> GetByCodeAsync(string code)
    {
        return await _db.Language
            .AsNoTracking()
            .Where(l => l.Code == code)
            .Select(l => new LanguageDto { Code = l.Code, Name = l.Name })
            .FirstOrDefaultAsync();
    }

    public async Task<LanguageDto> CreateAsync(CreateLanguageDto dto)
    {
        var normalizedCode = dto.Code.Trim();
        var normalizedName = dto.Name.Trim();

        var exists = await _db.Language.AnyAsync(l => l.Code == normalizedCode);
        if (exists)
        {
            throw new InvalidOperationException("Language with this code already exists.");
        }

        var entity = new Language { Code = normalizedCode, Name = normalizedName };
        _db.Language.Add(entity);
        await _db.SaveChangesAsync();
        return new LanguageDto { Code = entity.Code, Name = entity.Name };
    }
}