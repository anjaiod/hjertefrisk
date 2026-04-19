namespace backend.src.Domain.Models;

public class Patient
{
    public int Id { get; set; }
    public string SupabaseUserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Gender { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? RiskLevel { get; set; }

    public ICollection<Response> Responses { get; set; } = new List<Response>();
    public ICollection<AnsweredQuery> AnsweredQueries { get; set; } = new List<AnsweredQuery>();
    public ICollection<PatientAccess> PatientAccesses { get; set; } = new List<PatientAccess>();
    public ICollection<ToDo> ToDos { get; set; } = new List<ToDo>();
    public ICollection<MeasurementResult> MeasurementResults { get; set; } = new List<MeasurementResult>();
    public ICollection<PatientMeasureResult> PatientMeasureResults { get; set; } = new List<PatientMeasureResult>();
    public ICollection<PersonnelMeasureResult> PersonnelMeasureResults { get; set; } = new List<PersonnelMeasureResult>();
    public ICollection<Journalnotat> Journalnots { get; set; } = new List<Journalnotat>();
}
