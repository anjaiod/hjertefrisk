using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Measures.DTOs;

public class CreateMeasureDto
{
    [Required]
    public int QuestionId { get; set; }

    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }

    [Required]
    [StringLength(20, MinimumLength = 1)]
    public required string Operator { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public required string FallbackText { get; set; }
}
