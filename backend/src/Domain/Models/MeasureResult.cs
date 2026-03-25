namespace backend.src.Domain.Models;

public class PatientMeasureResult
{
    public int Id { get; set; }
    public int PatientMeasureId { get; set; }
    public int PatientId { get; set; }
    public int QueryId { get; set; }
    public int? CategoryId { get; set; }
    public int? TriggerQuestionId { get; set; }
    public int CategoryScore { get; set; }
    public MeasureResultSource Source { get; set; }
    public DateTime GeneratedAt { get; set; }

    public PatientMeasure Measure { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
    public Query? Query { get; set; }
    public Category? Category { get; set; }
    public Question? TriggerQuestion { get; set; }
}

public class PersonnelMeasureResult
{
    public int Id { get; set; }
    public int PersonnelMeasureId { get; set; }
    public int PatientId { get; set; }
    public int QueryId { get; set; }
    public int? CategoryId { get; set; }
    public int? TriggerQuestionId { get; set; }
    public int CategoryScore { get; set; }
    public MeasureResultSource Source { get; set; }
    public DateTime GeneratedAt { get; set; }
    public int? PersonnelId { get; set; }

    public PersonnelMeasure Measure { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
    public Personnel? Personnel { get; set; }
    public Query? Query { get; set; }
    public Category? Category { get; set; }
    public Question? TriggerQuestion { get; set; }
}
