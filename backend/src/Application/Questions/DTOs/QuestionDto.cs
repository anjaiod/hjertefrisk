namespace backend.src.Application.Questions.DTOs;

public class QuestionDto
{
    public int QuestionId { get; set; }
    public string FallbackText { get; set; } = "";
    public string QuestionType { get; set; } = "";
    public bool IsRequired { get; set; }
    public string? RequiredRole { get; set; }
}
