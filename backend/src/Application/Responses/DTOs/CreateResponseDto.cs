using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Responses.DTOs;

public class CreateResponseDto
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    public int QuestionId { get; set; }

    public int? SelectedOptionId { get; set; }
    public string? TextValue { get; set; }
    public decimal? NumberValue { get; set; }
}
