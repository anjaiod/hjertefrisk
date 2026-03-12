using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Personnel.DTOs;

public class CreatePersonnelDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(320, MinimumLength = 3)]
    public required string Email { get; set; }
}
