using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.QuestionOptions.DTOs;

public class CreateQuestionOptionDto
{
    [Required]
    public int QuestionId { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public required string FallbackText { get; set; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string OptionValue { get; set; }

    public int DisplayOrder { get; set; }
}
