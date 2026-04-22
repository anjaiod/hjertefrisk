namespace backend.src.Application.Measurements.DTOs;

public class MeasurementDto
{
    public int MeasurementId { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string Unit { get; set; } = "";
    public string FallbackText { get; set; } = "";
}
