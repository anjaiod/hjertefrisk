namespace backend.src.Domain.Models;

public class QuestionDependency
{
    public int ParentQueryId { get; set; }        // PK part, FK -> Query
    public int ParentQuestionId { get; set; }     // PK part, FK -> Question
    public int ChildQueryId { get; set; }         // PK part, FK -> Query
    public int ChildQuestionId { get; set; }      // PK part, FK -> Question

    public int? TriggerOptionId { get; set; }     // FK -> QuestionOption
    public string? TriggerTextValue { get; set; } 
    public decimal? TriggerNumberValue { get; set; } 
    public string Operator { get; set; } = "";    

    public Query ParentQuery { get; set; } = null!;
    public Question ParentQuestion { get; set; } = null!;
    public Query ChildQuery { get; set; } = null!;
    public Question ChildQuestion { get; set; } = null!;
    public QuestionOption? TriggerOption { get; set; }
}