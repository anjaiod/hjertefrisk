namespace backend.src.Domain.Models;

public class Severity
{
    public int SeverityId { get; set; }          // PK
    public int? QuestionId { get; set; }         // FK -> Question (nullable)
    public int? MeasurementId { get; set; }      // FK -> Measurement (nullable)
    public int? RequiredOption { get; set; }     // FK -> QuestionOption
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public int Score { get; set; }

    public Question? Question { get; set; }
    public Measurement? Measurement { get; set; }
    public QuestionOption? RequiredOptionNavigation { get; set; }
}