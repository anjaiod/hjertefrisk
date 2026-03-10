using backend.src.Application.Languages.DTOs;

namespace backend.src.Application.Languages.Interfaces;

public interface ILanguageService
{
    Task<IEnumerable<LanguageDto>> GetAllAsync();
    Task<LanguageDto?> GetByCodeAsync(string code);
    Task<LanguageDto> CreateAsync(CreateLanguageDto dto);
}