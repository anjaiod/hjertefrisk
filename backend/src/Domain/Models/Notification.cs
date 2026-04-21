namespace backend.src.Domain.Models;

public class Notification
{
    public int Id { get; set; }
    public int PersonnelId { get; set; }
    public int PatientId { get; set; }
    public int AnsweredQueryId { get; set; }
    public string Message { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool Read { get; set; } = false;
    public DateTime? ReadAt { get; set; } = null; // timestamp when marked read by this personnel, used to remove from notification list at the end of day, but not without having been read

    public Personnel Personnel { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
    public AnsweredQuery AnsweredQuery { get; set; } = null!;
}
