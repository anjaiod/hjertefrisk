namespace backend.src.Domain.Models;

public class Journalnotat
{
    public int JournalnotatId { get; set; }
    public int PatientId { get; set; }
    public int PersonnelId { get; set; }
    public string Type { get; set; } = "JournalNotat"; // Konsultasjon | JournalNotat | Henvisning
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsPrivate { get; set; } = false;
    public DateTime? SignedAt { get; set; }
    public int? SignedByPersonnelId { get; set; }

    public Patient Patient { get; set; } = null!;
    public Personnel CreatedBy { get; set; } = null!;
}
