using backend.src.Application.Severities.DTOs;

namespace backend.src.Application.Severities.Interfaces;

public interface ISeverityService
{
    Task<IEnumerable<SeverityDto>> GetAllAsync();
    Task<SeverityDto> CreateAsync(CreateSeverityDto dto);
}
