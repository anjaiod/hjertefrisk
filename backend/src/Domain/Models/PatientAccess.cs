namespace backend.src.Domain.Models;

public class PatientAccess
{
    public int PatientId { get; set; }    // PK part, FK -> Patient
    public int PersonnelId { get; set; }  // PK part, FK -> Personnel

    public Patient Patient { get; set; } = null!;
    public Personnel Personnel { get; set; } = null!;
}