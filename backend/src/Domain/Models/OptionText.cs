namespace backend.src.Domain.Models;

public class OptionText
{
    public int QuestionOptionId { get; set; }                 // PK part, FK -> QuestionOption
    public string LanguageCode { get; set; } = "";    // PK part, FK -> Language
    public string Text { get; set; } = "";

    public QuestionOption Option { get; set; } = null!;
    public Language Language { get; set; } = null!;
}