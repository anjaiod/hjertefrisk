using backend.src.Application.Personnel.DTOs;

namespace backend.src.Application.Personnel.Interfaces;

public interface IPersonnelService
{
    Task<IEnumerable<PersonnelDto>> GetAllAsync();
    Task<PersonnelDto> CreateAsync(CreatePersonnelDto dto);
    Task<PersonnelDto?> GetBySupabaseUserIdAsync(string supabaseUserId);
}
