using backend.src.Application.QuickMeasures.DTOs;

namespace backend.src.Application.QuickMeasures.Interfaces;

public interface IQuickMeasureService
{
    Task<IEnumerable<QuickMeasureDto>> GetAllAsync();
    Task<QuickMeasureDto> CreateAsync(CreateQuickMeasureDto dto);
    Task<IReadOnlyCollection<QuickMeasureResultDto>> EvaluateAsync(EvaluateQuickMeasuresDto dto);
}
