namespace backend.src.Application.Patients.DTOs;

public class PatientDto
{
    public int Id { get; set; }
    public string SupabaseUserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Gender { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastVisited { get; set; }
    public string? RiskLevel { get; set; }
}
