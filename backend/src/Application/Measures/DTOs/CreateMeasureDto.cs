using System.ComponentModel.DataAnnotations;
using backend.src.Domain.Models;

namespace backend.src.Application.Measures.DTOs;

public abstract class BaseCreateMeasureDto
{
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }

    [Required]
    public MeasureTriggerType TriggerType { get; set; } = MeasureTriggerType.Question;

    [Range(0, int.MaxValue)]
    public int ScoreThreshold { get; set; }

    public bool IsExclusive { get; set; }
    public int Priority { get; set; }

    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }

    [StringLength(20, MinimumLength = 1)]
    public string? Operator { get; set; }

    [StringLength(250, MinimumLength = 1)]
    public string? Title { get; set; }

    [StringLength(1000)]
    public string? ResourceUrl { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public required string FallbackText { get; set; }
}

public class CreatePatientMeasureDto : BaseCreateMeasureDto
{
}

public class CreatePersonnelMeasureDto : BaseCreateMeasureDto
{
}
