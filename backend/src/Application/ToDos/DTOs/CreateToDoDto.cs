using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.ToDos.DTOs;

public class CreateToDoDto
{
    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public required string ToDoText { get; set; }

    [Required]
    public int PatientId { get; set; }

    [Required]
    public int PersonnelId { get; set; }

    public bool Finished { get; set; }
    public bool Public { get; set; }
}
