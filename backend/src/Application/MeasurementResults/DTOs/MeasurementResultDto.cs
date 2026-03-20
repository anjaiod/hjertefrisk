namespace backend.src.Application.MeasurementResults.DTOs;

public class MeasurementResultDto
{
    public int MeasurementId { get; set; }
    public int PatientId { get; set; }
    public decimal Result { get; set; }
    public int RegisteredBy { get; set; }
    public DateTime RegisteredAt { get; set; }
}
