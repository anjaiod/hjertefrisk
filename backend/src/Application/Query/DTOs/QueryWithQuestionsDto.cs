namespace backend.src.Application.Queries.DTOs;

public class QueryWithQuestionsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public List<QuestionWithDetailsDto> Questions { get; set; } = new();
}

public class QuestionWithDetailsDto
{
    public int QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string FallbackText { get; set; } = "";
    public string QuestionType { get; set; } = "";
    public bool IsRequired { get; set; }
    public string? RequiredRole { get; set; }
    public int DisplayOrder { get; set; }
    public List<QuestionOptionDto> Options { get; set; } = new();
    public List<QuestionDependencyDto> Dependencies { get; set; } = new();
}

public class QuestionOptionDto
{
    public int QuestionOptionId { get; set; }
    public string FallbackText { get; set; } = "";
    public string OptionValue { get; set; } = "";
    public int DisplayOrder { get; set; }
}

public class QuestionDependencyDto
{
    public int ParentQuestionId { get; set; }
    public int ChildQuestionId { get; set; }
    public int? TriggerOptionId { get; set; }
    public string? TriggerOptionValue { get; set; }
    public string? TriggerTextValue { get; set; }
    public string Operator { get; set; } = "";
}