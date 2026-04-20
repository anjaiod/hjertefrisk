namespace backend.src.Application.ToDos.DTOs;

public class ToDoRuleDto
{
    public int ToDoRuleId { get; set; }
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int? ScoreThreshold { get; set; }
    public string TriggerType { get; set; } = "";
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public string ToDoText { get; set; } = "";
    public int Priority { get; set; }
    public bool IsExclusive { get; set; }
}

public class CreateToDoRuleDto
{
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int? ScoreThreshold { get; set; }
    public string TriggerType { get; set; } = "";
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string Operator { get; set; } = "";
    public string ToDoText { get; set; } = "";
    public int Priority { get; set; }
    public bool IsExclusive { get; set; }
}
