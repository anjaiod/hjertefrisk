namespace backend.src.Domain.Models;

public class QueryQuestion
{
    public int QueryId { get; set; }     // PK part, FK -> Query
    public int QuestionId { get; set; }  // PK part, FK -> Question
    public int DisplayOrder { get; set; }

    public Query Query { get; set; } = null!;
    public Question Question { get; set; } = null!;
}