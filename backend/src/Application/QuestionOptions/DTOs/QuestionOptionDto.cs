namespace backend.src.Application.QuestionOptions.DTOs;

public class QuestionOptionDto
{
    public int QuestionOptionId { get; set; }
    public int QuestionId { get; set; }
    public string FallbackText { get; set; } = "";
    public string OptionValue { get; set; } = "";
    public int DisplayOrder { get; set; }
}
