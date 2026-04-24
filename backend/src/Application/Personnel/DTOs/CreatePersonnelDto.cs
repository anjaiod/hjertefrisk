using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Personnel.DTOs;

public class CreatePersonnelDto
{
    [Required]
    [StringLength(128, MinimumLength = 1)]
    public required string SupabaseUserId { get; set; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    [RegularExpression(@"^[^\d]*$", ErrorMessage = "Name must not contain numbers")]
    public required string Name { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(320, MinimumLength = 3)]
    public required string Email { get; set; }
}
