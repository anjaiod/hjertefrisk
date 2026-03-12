namespace backend.src.Application.Measures.DTOs;

public class MeasureDto
{
    public int MeasureId { get; set; }
    public int QuestionId { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public string FallbackText { get; set; } = "";
}
