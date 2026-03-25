namespace backend.src.Application.Measures.DTOs;

public class EvaluateMeasuresDto
{
    public int PatientId { get; set; }
    public int QueryId { get; set; }
    public string? LanguageCode { get; set; }
    public int? PersonnelId { get; set; }
}
