namespace backend.src.Domain.Models;

public class QuestionText
{
    public int QuestionId { get; set; }              // PK part, FK -> Question
    public string LanguageCode { get; set; } = "";   // PK part, FK -> Language
    public string Text { get; set; } = "";

    public Question Question { get; set; } = null!;
    public Language Language { get; set; } = null!;
}