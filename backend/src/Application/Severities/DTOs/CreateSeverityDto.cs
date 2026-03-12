using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Severities.DTOs;

public class CreateSeverityDto
{
    public int? QuestionId { get; set; }
    public int? MeasurementId { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }

    [Required]
    [StringLength(20, MinimumLength = 1)]
    public required string Operator { get; set; }

    [Required]
    public int Score { get; set; }
}
