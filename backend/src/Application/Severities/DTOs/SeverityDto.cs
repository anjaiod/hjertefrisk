namespace backend.src.Application.Severities.DTOs;

public class SeverityDto
{
    public int SeverityId { get; set; }
    public int? QuestionId { get; set; }
    public int? MeasurementId { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public int Score { get; set; }
}
