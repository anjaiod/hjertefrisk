namespace backend.src.Domain.Models;

public class Severity
{
    public int SeverityId { get; set; }          // PK
    public int QuestionId { get; set; }          // FK -> Question
    public int? RequiredOption { get; set; }     // FK -> QuestionOption
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public int Score { get; set; }

    public Question Question { get; set; } = null!;
    public QuestionOption? RequiredOptionNavigation { get; set; }
}