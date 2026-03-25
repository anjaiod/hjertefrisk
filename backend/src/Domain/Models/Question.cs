namespace backend.src.Domain.Models;

public class Question
{
    public int QuestionId { get; set; }              // PK
    public int? CategoryId { get; set; }
    public int? MeasurementId { get; set; }          // FK -> Measurement (optional)
    public string FallbackText { get; set; } = "";
    public string QuestionType { get; set; } = "";
    public bool IsRequired { get; set; }
    public string? RequiredRole { get; set; }

    public Category? Category { get; set; }
    public Measurement? Measurement { get; set; }

    public ICollection<QuestionText> Texts { get; set; } = new List<QuestionText>();
    public ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    public ICollection<Response> Responses { get; set; } = new List<Response>();

    // Dependency navigation convenience
    public ICollection<QuestionDependency> ParentDependencies { get; set; } = new List<QuestionDependency>();
    public ICollection<QuestionDependency> ChildDependencies { get; set; } = new List<QuestionDependency>();

    public ICollection<PatientMeasure> PatientMeasures { get; set; } = new List<PatientMeasure>();
    public ICollection<PersonnelMeasure> PersonnelMeasures { get; set; } = new List<PersonnelMeasure>();
    public ICollection<Severity> Severities { get; set; } = new List<Severity>();
    public ICollection<QueryQuestion> QueryQuestions { get; set; } = new List<QueryQuestion>();
}