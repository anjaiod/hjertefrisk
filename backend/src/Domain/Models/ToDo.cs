namespace backend.src.Domain.Models;

public class ToDo
{
    public int ToDoId { get; set; }           // PK
    public bool Finished { get; set; }
    public string ToDoText { get; set; } = "";
    public int PatientId { get; set; }        // FK -> Patient
    public int PersonnelId { get; set; }      // FK -> Personnel
    public bool Public { get; set; }

    public Patient Patient { get; set; } = null!;
    public Personnel Personnel { get; set; } = null!;
}