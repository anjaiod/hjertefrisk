namespace backend.src.Domain.Models;

public class Measurement
{
    public int MeasurementId { get; set; }            // PK
    public string Unit { get; set; } = "";
    public string FallbackText { get; set; }

    public ICollection<MeasurementText> Texts { get; set; } = new List<MeasurementText>();
    public ICollection<MeasurementResult> Results { get; set; } = new List<MeasurementResult>();
    public ICollection<Severity> Severities { get; set; } = new List<Severity>();
}

public class MeasurementText
{
    public int MeasurementId { get; set; }                 // PK part, FK -> Measurement
    public string LanguageCode { get; set; } = "";  // PK part, FK -> Language
    public string Text { get; set; } = "";

    public Measurement Measurement { get; set; } = null!;
    public Language Language { get; set; } = null!;
}

public class MeasurementResult
{
    public int MeasurementId { get; set; }              // PK part, FK -> Measurement
    public int PatientId { get; set; }           // PK part, FK -> Patient
    public DateTime RegisteredAt { get; set; }   // PK part
    public decimal Result { get; set; }
    public int RegisteredBy { get; set; }        // FK -> Personnel

    public Measurement Measurement { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
    public Personnel RegisteredByPersonnel { get; set; } = null!;
}