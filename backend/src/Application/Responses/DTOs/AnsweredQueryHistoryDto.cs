namespace backend.src.Application.Responses.DTOs;

public class AnsweredQueryHistoryDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ResponseHistoryItemDto> Responses { get; set; } = new();
}

public class ResponseHistoryItemDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = "";
    public string? AnswerText { get; set; }
    public decimal? NumberValue { get; set; }
}
