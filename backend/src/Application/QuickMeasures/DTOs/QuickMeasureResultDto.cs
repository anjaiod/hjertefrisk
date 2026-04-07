namespace backend.src.Application.QuickMeasures.DTOs;

public class QuickMeasureResultDto
{
    public int QuickMeasureId { get; set; }
    public string FallbackText { get; set; } = "";
    public string? Title { get; set; }
    public string? ResourceUrl { get; set; }
    public int Priority { get; set; }
}
