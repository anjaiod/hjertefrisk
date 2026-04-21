namespace backend.src.Domain.Models;

public class Response
{
    public int AnsweredQueryId { get; set; }      // PK part, FK -> AnsweredQuery
    public int PatientId { get; set; }            // PK part, FK -> Patient
    public int? QuestionId { get; set; }           // PK part, FK -> Question

    public int? SelectedOptionId { get; set; }    // FK -> QuestionOption
    public string? TextValue { get; set; }
    public decimal? NumberValue { get; set; }
    public DateTime CreatedAt { get; set; }

    public AnsweredQuery AnsweredQuery { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
    public Question? Question { get; set; } = null!;
    public QuestionOption? SelectedOption { get; set; }
}
