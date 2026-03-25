using backend.src.Application.Measures.DTOs;

namespace backend.src.Application.Measures.Interfaces;

public interface IMeasureEvaluationService
{
    Task<MeasureEvaluationResultDto> EvaluateAsync(EvaluateMeasuresDto dto);
}
