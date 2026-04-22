using backend.src.Domain.Models;

namespace backend.src.Application.Measures.DTOs;

public class PatientMeasureResultDto
{
    public int PatientMeasureId { get; set; }
    public MeasureResultSource Source { get; set; }
    public int? CategoryId { get; set; }
    public int? TriggerQuestionId { get; set; }
    public int CategoryScore { get; set; }
    public string Text { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? ResourceUrl { get; set; }
    public DateTime GeneratedAt { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public DateTime? BasedOnDate { get; set; }
    public string? BasedOnPersonnelName { get; set; }
}

public class PersonnelMeasureResultDto
{
    public int PersonnelMeasureId { get; set; }
    public MeasureResultSource Source { get; set; }
    public int? CategoryId { get; set; }
    public int? TriggerQuestionId { get; set; }
    public int CategoryScore { get; set; }
    public string Text { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? ResourceUrl { get; set; }
    public DateTime GeneratedAt { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public DateTime? BasedOnDate { get; set; }
    public string? BasedOnPersonnelName { get; set; }
}
