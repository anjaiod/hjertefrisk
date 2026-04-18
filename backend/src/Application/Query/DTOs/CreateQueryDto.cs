using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Queries.DTOs;

public class CreateQueryDto
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public required string Name { get; set; }
}