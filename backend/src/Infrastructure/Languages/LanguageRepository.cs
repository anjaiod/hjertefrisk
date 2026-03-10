using backend.src.Application.Languages.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Infrastructure.Languages;

public class LanguageRepository : ILanguageRepository
{
    private readonly AppDbContext _db;

    public LanguageRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Language>> GetAllAsync()
    {
        return await _db.Language.AsNoTracking().ToListAsync();
    }

    public async Task<Language?> GetByCodeAsync(string code)
    {
        return await _db.Language.FindAsync(code);
    }

    public async Task AddAsync(Language language)
    {
        _db.Language.Add(language);
        await _db.SaveChangesAsync();
    }
}