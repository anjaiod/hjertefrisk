using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Journalnots.DTOs;

public class CreateJournalnotatDto
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = "JournalNotat";

    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Title { get; set; } = "";

    public string Content { get; set; } = "";

    public bool IsPrivate { get; set; } = false;
}
