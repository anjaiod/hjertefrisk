namespace backend.src.Domain.Models;

public class QuestionOption
{
    public int QuestionOptionId { get; set; }            // PK
    public int QuestionId { get; set; }          // FK -> Question
    public string FallbackText { get; set; }
    public string OptionValue { get; set; } = "";
    public int DisplayOrder { get; set; }

    public Question Question { get; set; } = null!;
    public ICollection<OptionText> Texts { get; set; } = new List<OptionText>();
}