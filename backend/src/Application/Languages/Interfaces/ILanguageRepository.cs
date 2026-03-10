using backend.src.Domain.Models;

namespace backend.src.Application.Languages.Interfaces;

public interface ILanguageRepository
{
    Task<IEnumerable<Language>> GetAllAsync();
    Task<Language?> GetByCodeAsync(string code);
    Task AddAsync(Language language);
}