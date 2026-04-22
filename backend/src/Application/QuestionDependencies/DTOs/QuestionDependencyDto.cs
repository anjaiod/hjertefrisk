namespace backend.src.Application.QuestionDependencies.DTOs;

public class QuestionDependencyDto
{
    public int ParentQueryId { get; set; }
    public int ParentQuestionId { get; set; }
    public int ChildQueryId { get; set; }
    public int ChildQuestionId { get; set; }
    public int? TriggerOptionId { get; set; }
    public string? TriggerTextValue { get; set; }
    public decimal? TriggerNumberValue { get; set; }
    public string Operator { get; set; } = "";
}
