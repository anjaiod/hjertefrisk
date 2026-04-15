namespace backend.src.Domain.Models;

public class QuickMeasure
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

    public Question? Question { get; set; }
    public Category? Category { get; set; }
    public QuestionOption? RequiredOptionNavigation { get; set; }
}
