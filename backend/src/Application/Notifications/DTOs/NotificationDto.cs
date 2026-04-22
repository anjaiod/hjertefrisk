namespace backend.src.Application.Notifications.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int AnsweredQueryId { get; set; }
    public string Message { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public bool Read { get; set; }
    public DateTime? ReadAt { get; set; }
}
