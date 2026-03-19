namespace backend.src.Application.Patients.DTOs;

public class LatestMeasurementResultDto
{
    public int MeasurementId { get; set; }
    public decimal Result { get; set; }
    public DateTime RegisteredAt { get; set; }
}
