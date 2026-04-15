namespace backend.src.Application.QuickMeasures.DTOs;

public class EvaluateQuickMeasuresDto
{
    public int PatientId { get; set; }
    public int QueryId { get; set; }
    public int AnsweredQueryId { get; set; }
}
