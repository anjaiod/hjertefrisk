namespace backend.src.Domain.Models;

public class AnsweredQuery
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime CreatedAt { get; set; }

    public Patient Patient { get; set; } = null!;
    public ICollection<Response> Responses { get; set; } = new List<Response>();
}
