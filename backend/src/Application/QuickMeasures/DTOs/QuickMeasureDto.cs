using backend.src.Domain.Models;

namespace backend.src.Application.QuickMeasures.DTOs;

public class QuickMeasureDto
{
    public int QuickMeasureId { get; set; }
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public MeasureTriggerType TriggerType { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string? Operator { get; set; }
    public string FallbackText { get; set; } = "";
    public string? Title { get; set; }
    public string? ResourceUrl { get; set; }
}

public class CreateQuickMeasureDto
{
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public MeasureTriggerType TriggerType { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string? Operator { get; set; }
    public string FallbackText { get; set; } = "";
    public string? Title { get; set; }
    public string? ResourceUrl { get; set; }
}
