namespace backend.src.Application.Journalnots.DTOs;

public class JournalnotatDto
{
    public int JournalnotatId { get; set; }
    public int PatientId { get; set; }
    public int PersonnelId { get; set; }
    public string PersonnelName { get; set; } = "";
    public string Type { get; set; } = "";
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsPrivate { get; set; }
    public DateTime? SignedAt { get; set; }
    public int? SignedByPersonnelId { get; set; }
    public string? SignedByPersonnelName { get; set; }
}
