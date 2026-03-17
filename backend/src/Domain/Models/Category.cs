namespace backend.src.Domain.Models;

public class Category
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = "";

    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Measurement> Measurements { get; set; } = new List<Measurement>();
}
