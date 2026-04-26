namespace backend.src.Application.Responses.DTOs;

public class LatestResponseItemDto
{
    public int QuestionId { get; set; }
    public int DisplayOrder { get; set; }
    public string QuestionText { get; set; } = "";
    public string? AnswerText { get; set; }
    public decimal? NumberValue { get; set; }
    public DateTime? AnsweredAt { get; set; }
    public int? AnsweredQueryId { get; set; }
    public string? FilledInByName { get; set; }
}
