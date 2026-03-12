using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Questions.DTOs;

public class CreateQuestionDto
{
    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public required string FallbackText { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public required string QuestionType { get; set; }

    public bool IsRequired { get; set; }
    public string? RequiredRole { get; set; }
}
