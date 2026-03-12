namespace backend.src.Domain.Models;

public class Query
{
    public int Id { get; set; }          // PK
    public string Name { get; set; } = "";

    public ICollection<QueryQuestion> QueryQuestions { get; set; } = new List<QueryQuestion>();

    // Dependency navigation convenience
    public ICollection<QuestionDependency> ParentDependencies { get; set; } = new List<QuestionDependency>();
    public ICollection<QuestionDependency> ChildDependencies { get; set; } = new List<QuestionDependency>();
}