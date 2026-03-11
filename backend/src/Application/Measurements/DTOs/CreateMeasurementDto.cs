using System.ComponentModel.DataAnnotations;

namespace backend.src.Application.Measurements.DTOs;

public class CreateMeasurementDto
{
    [Required]
    [StringLength(50, MinimumLength = 1)]
    public required string Unit { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public required string FallbackText { get; set; }
}
