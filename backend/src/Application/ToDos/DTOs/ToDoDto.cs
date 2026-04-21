namespace backend.src.Application.ToDos.DTOs;

public class ToDoDto
{
    public int ToDoId { get; set; }
    public bool Finished { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int? FinishedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ToDoText { get; set; } = "";
    public int PatientId { get; set; }
    public int? PersonnelId { get; set; }
    public bool Public { get; set; }
}
