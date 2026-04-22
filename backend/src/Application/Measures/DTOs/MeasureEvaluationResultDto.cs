namespace backend.src.Application.Measures.DTOs;

public class MeasureEvaluationResultDto
{
    public IReadOnlyCollection<PatientMeasureResultDto> PatientMeasures { get; init; } = Array.Empty<PatientMeasureResultDto>();
    public IReadOnlyCollection<PersonnelMeasureResultDto> PersonnelMeasures { get; init; } = Array.Empty<PersonnelMeasureResultDto>();
    public IReadOnlyDictionary<int, int> CategoryScores { get; init; } = new Dictionary<int, int>();
}
