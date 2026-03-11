using backend.src.Application.Measures.DTOs;

namespace backend.src.Application.Measures.Interfaces;

public interface IMeasureService
{
    Task<IEnumerable<MeasureDto>> GetAllAsync();
    Task<MeasureDto> CreateAsync(CreateMeasureDto dto);
}
