using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Categories.DTOs;

public class CreateCategoryDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; set; }
}
