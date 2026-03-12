using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.QuestionDependencies.DTOs;

public class CreateQuestionDependencyDto
{
    [Required]
    public int ParentQueryId { get; set; }

    [Required]
    public int ParentQuestionId { get; set; }

    [Required]
    public int ChildQueryId { get; set; }

    [Required]
    public int ChildQuestionId { get; set; }

    public int? TriggerOptionId { get; set; }
    public string? TriggerTextValue { get; set; }
    public decimal? TriggerNumberValue { get; set; }

    [Required]
    [StringLength(20, MinimumLength = 1)]
    public required string Operator { get; set; }
}
