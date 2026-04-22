namespace backend.src.Domain.Models;

public class Category
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = "";

    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Measurement> Measurements { get; set; } = new List<Measurement>();
    public ICollection<PatientMeasure> PatientMeasures { get; set; } = new List<PatientMeasure>();
    public ICollection<PersonnelMeasure> PersonnelMeasures { get; set; } = new List<PersonnelMeasure>();
    public ICollection<QuickMeasure> QuickMeasures { get; set; } = new List<QuickMeasure>();
}
