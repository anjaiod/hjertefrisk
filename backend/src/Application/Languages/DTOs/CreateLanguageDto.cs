using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Languages.DTOs;

public class CreateLanguageDto
{
    [Required]
    [StringLength(10, MinimumLength = 2)]
    public string Code { get; set; } = "";

    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = "";
}