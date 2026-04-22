using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Patients.DTOs;

public class CreatePatientDto
{
    [Required]
    [StringLength(128, MinimumLength = 1)]
    public required string SupabaseUserId { get; set; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(320, MinimumLength = 3)]
    public required string Email { get; set; }

    [StringLength(20)]
    public string? Gender { get; set; }
}
