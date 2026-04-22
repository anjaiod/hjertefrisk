namespace backend.src.Domain.Models;

public class ToDo
{
    public int ToDoId { get; set; }           // PK
    public bool Finished { get; set; }
    public DateTime? FinishedAt { get; set; } // When the todo was marked as finished
    public int? FinishedBy { get; set; }      // FK -> Personnel (who marked it finished)
    public string ToDoText { get; set; } = "";
    public int PatientId { get; set; }        // FK -> Patient
    public int? PersonnelId { get; set; }      // FK -> Personnel 
    public int? ToDoRuleId { get; set; }      // FK -> ToDoRule (nullable for manually created todos)
    public bool Public { get; set; }
    public DateTime CreatedAt { get; set; }

    public Patient Patient { get; set; } = null!;
    public Personnel Personnel { get; set; } = null!;
}

public abstract class ToDoRule
{
    public int ToDoRuleId { get; set; }
    public string Operator { get; set; } = "";
    public string ToDoText { get; set; } = "";
    public int Priority { get; set; }
}

public class QuestionAnswerRule : ToDoRule
{
    public int QuestionId { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }

    public Question? Question { get; set; }
    public QuestionOption? RequiredOptionNavigation { get; set; }
}

public class CategoryScoreRule : ToDoRule
{
    public int CategoryId { get; set; }
    public int ScoreThreshold { get; set; }

    public Category? Category { get; set; }
}

public enum ToDoRuleType
{
    Question = 0,
    Category = 1,
}