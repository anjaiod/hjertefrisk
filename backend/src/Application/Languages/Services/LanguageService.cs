using backend.src.Application.Languages.DTOs;
using backend.src.Application.Languages.Interfaces;
using backend.src.Domain.Models;

namespace backend.src.Application.Languages.Services;

public class LanguageService : ILanguageService
{
    private readonly ILanguageRepository _repo;

    public LanguageService(ILanguageRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<LanguageDto>> GetAllAsync()
    {
        var items = await _repo.GetAllAsync();
        return items.Select(x => new LanguageDto { Code = x.Code, Name = x.Name });
    }

    public async Task<LanguageDto?> GetByCodeAsync(string code)
    {
        var item = await _repo.GetByCodeAsync(code);
        if (item == null) return null;
        return new LanguageDto { Code = item.Code, Name = item.Name };
    }

    public async Task<LanguageDto> CreateAsync(CreateLanguageDto dto)
    {
        var existing = await _repo.GetByCodeAsync(dto.Code);
        if (existing != null)
        {
            throw new InvalidOperationException("Language with this code already exists.");
        }

        var entity = new Language { Code = dto.Code, Name = dto.Name };
        await _repo.AddAsync(entity);
        return new LanguageDto { Code = entity.Code, Name = entity.Name };
    }
}