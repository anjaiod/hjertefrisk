namespace backend.src.Application.Responses.DTOs;

public class ResponseDto
{
    public int PatientId { get; set; }
    public int QuestionId { get; set; }
    public int? SelectedOptionId { get; set; }
    public string? TextValue { get; set; }
    public decimal? NumberValue { get; set; }
    public DateTime CreatedAt { get; set; }
}
