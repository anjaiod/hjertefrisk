using backend.src.Domain.Models;

namespace backend.src.Application.Measures.DTOs;

public class PatientMeasureDto
{
    public int PatientMeasureId { get; set; }
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public MeasureTriggerType TriggerType { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public string FallbackText { get; set; } = "";
}

public class PersonnelMeasureDto
{
    public int PersonnelMeasureId { get; set; }
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public MeasureTriggerType TriggerType { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public string FallbackText { get; set; } = "";
}
