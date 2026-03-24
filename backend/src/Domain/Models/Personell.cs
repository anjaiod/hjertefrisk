namespace backend.src.Domain.Models;

public class Personnel
{
    public int Id { get; set; }              // PK
    public string SupabaseUserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";  
    public DateTime CreatedAt { get; set; }

    public ICollection<PatientAccess> PatientAccesses { get; set; } = new List<PatientAccess>();
    public ICollection<ToDo> ToDos { get; set; } = new List<ToDo>();
    public ICollection<MeasurementResult> RegisteredMeasurementResults { get; set; } = new List<MeasurementResult>();
    public ICollection<PersonnelMeasureResult> PersonnelMeasureResults { get; set; } = new List<PersonnelMeasureResult>();
}
