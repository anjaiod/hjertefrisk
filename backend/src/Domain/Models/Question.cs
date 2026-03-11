namespace backend.src.Domain.Models;

public class Question
{
    public int QuestionId { get; set; }              // PK
    public string FallbackText { get; set; }        
    public string QuestionType { get; set; } = "";   
    public bool IsRequired { get; set; }
    public string? RequiredRole { get; set; }        

    public ICollection<QuestionText> Texts { get; set; } = new List<QuestionText>();
    public ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    public ICollection<Response> Responses { get; set; } = new List<Response>();

    // Dependency navigation convenience
    public ICollection<QuestionDependency> ParentDependencies { get; set; } = new List<QuestionDependency>();
    public ICollection<QuestionDependency> ChildDependencies { get; set; } = new List<QuestionDependency>();

    public ICollection<Measure> Measures { get; set; } = new List<Measure>();
    public ICollection<Severity> Severities { get; set; } = new List<Severity>();
    public ICollection<QueryQuestion> QueryQuestions { get; set; } = new List<QueryQuestion>();
}